/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  Build,
  ModelAttachment,
  timestamp,
} from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import {
  PouchDB,
  PouchReplicationOptions,
  RxAttachmentCreator,
  RxCollection,
  RxDocument,
  RxReplicationState,
} from '@manuscripts/rxdb'
import { ConflictManager } from '@manuscripts/sync-client'
import axios, { AxiosError } from 'axios'
import generateReplicationID from 'pouchdb-generate-replication-id'
import { v4 as uuid } from 'uuid'

import { CollectionName, collections } from '../collections'
import { Database } from '../components/DatabaseProvider'
import config from '../config'
import sessionID from '../lib/session-id'
import { actions } from './syncEvents'
import { Store } from './SyncStore'
import {
  BulkDocsError,
  BulkDocsSuccess,
  Direction,
  PouchReplicationError,
} from './types'

const externalSessionID = uuid()

export interface ContainerIDs {
  containerID?: string
  manuscriptID?: string
  templateID?: string
}

export const isBulkDocsSuccess = (
  item: BulkDocsSuccess | BulkDocsError
): item is BulkDocsSuccess => {
  return 'ok' in item && item.ok === true
}

export const isBulkDocsError = (
  item: BulkDocsSuccess | BulkDocsError
): item is BulkDocsError => {
  return 'error' in item && item.error
}

export const isAxiosError = (
  error: Error | PouchReplicationError | AxiosError
): error is AxiosError => {
  return 'isAxiosError' in error && error.isAxiosError
}

export const isReplicationError = (
  error: Error | PouchReplicationError | AxiosError
): error is PouchReplicationError => {
  return Boolean(
    'result' in error &&
      error.result &&
      'status' in error.result &&
      error.result.status
  )
}

export const promisifyReplicationState = (
  replicationState: RxReplicationState
) =>
  new Promise((resolve, reject) => {
    replicationState.complete$.subscribe((complete) => {
      if (complete) {
        resolve()
      }
    })

    replicationState.error$.subscribe((error) => {
      if (error) {
        reject(error)
      }
    })
  })

// TODO: hash?
export const buildCollectionName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9_]/g, '_')

const fetchWithCredentials: Fetch = (url, opts = {}) =>
  (PouchDB as any).fetch(url, {
    ...opts,
    credentials: 'include',
  })

export interface CollectionProps {
  collection: CollectionName
  channels?: string[]
  db: Database
}

export class Collection<T extends Model> {
  public props: CollectionProps

  public collection?: RxCollection<T>
  public conflictManager?: ConflictManager

  public collectionName: string

  private store?: Store
  private replications: RxReplicationState[]

  public constructor(props: CollectionProps, store?: Store) {
    this.collectionName = buildCollectionName(props.collection)
    this.props = props
    this.replications = []
    this.store = store
  }

  public async initialize(startSyncing = true) {
    this.collection = await this.openCollection(this.collectionName)

    this.collection.preRemove((plainData) => {
      plainData.sessionID = sessionID
    }, false)

    this.conflictManager = new ConflictManager(
      this.collection as RxCollection<Model>,
      this.broadcastPurge
    )

    const pouch = this.collection.pouch as PouchDB & EventEmitter
    pouch.setMaxListeners(50)

    // one-time pull from backup on initialization
    if (config.native && config.backupReplication.path) {
      await this.backupPullOnce({
        retry: false,
        live: false,
      })

      // continuous push to backup
      this.backupPush({
        live: true,
        retry: true,
      })
    }

    if (startSyncing) {
      this.startSyncing().catch((error) => {
        this.dispatchSyncError('pull', error)
      })
    }

    if (this.store) {
      this.store.dispatch(
        actions.open(this.collectionName, {
          remoteUrl: this.getRemoteUrl(),
          backupUrl: config.backupReplication.path ? this.getBackupUrl() : '',
          channels: this.props.channels || [],
          isProject: this.collectionName.startsWith('project_'),
        })
      )
    }
  }

  public syncOnce(
    direction: Direction,
    options: PouchReplicationOptions = {}
  ): Promise<void> {
    const replicationState = this.sync(direction, {
      ...options,
      live: false,
      retry: false,
    })

    if (!replicationState) {
      return Promise.resolve()
    }

    return promisifyReplicationState(replicationState).then(() => {
      return
    })
  }

  public async startSyncing() {
    // TODO: need to know if initial push failed?
    // await this.syncOnce('push')

    try {
      await this.syncOnce('pull')
      this.store &&
        this.store.dispatch(
          actions.replicationComplete(this.collectionName, 'pull')
        )
    } catch (e) {
      if (this.store) {
        this.store.dispatch(actions.initialPullFailed(this.collectionName))
      } else {
        throw e
      }
    }

    this.replications = [
      // start ongoing pull sync
      this.sync('pull', {
        live: true,
        retry: true,
      }),

      // start ongoing push sync
      this.sync('push', {
        live: true,
        retry: true,
      }),
    ]
  }

  public cancelReplications = () => {
    this.replications.map((replicationState) => {
      if (replicationState) {
        this.cancelReplication(replicationState)
      }
    })
    this.replications = []

    this.store && this.store.dispatch(actions.cancel(this.collectionName))
  }

  public ensurePushSync = async () => {
    try {
      await this.cancelReplications()
      await this.syncOnce('push', { live: false, retry: false })
      await this.startSyncing()
      return
    } catch (error) {
      this.dispatchSyncError('push', error)
    }
  }

  public getCollection(): RxCollection<T> {
    if (!this.collection) {
      throw new Error('Collection not initialized')
    }

    return this.collection
  }

  public find(queryObj?: Record<string, unknown>) {
    return this.getCollection().find(queryObj)
  }

  public findOne(queryObj: string | Record<string, unknown>) {
    return this.getCollection().findOne(queryObj)
  }

  public async findDoc(id: string) {
    const doc = await this.findOne(id).exec()

    if (!doc) {
      throw new Error(`Document ${id} not found`)
    }

    return doc
  }

  public async save(
    data: T | Partial<T> | Build<T>,
    ids?: ContainerIDs,
    external = false
  ): Promise<T> {
    const doc = data._id ? await this.findOne(data._id).exec() : null

    return doc
      ? this.update(doc._id, data as Partial<T>, external)
      : this.create(data as Build<T>, ids, external)
  }

  public requiredFields(external = false): Partial<Model> {
    const createdAt = timestamp()

    return {
      createdAt,
      updatedAt: createdAt,
      sessionID: external ? externalSessionID : sessionID,
    }
  }

  public async create(data: Build<T>, ids?: ContainerIDs, external = false) {
    const model: T = {
      ...(data as T),
      ...this.requiredFields(external),
      ...ids,
    }

    try {
      const result = await this.getCollection().insert(model)
      return result.toJSON()
    } catch (e) {
      this.dispatchWriteError('create', e)
      throw e
    }
  }

  public async update(
    id: string,
    data: Partial<T>,
    external = false
  ): Promise<T> {
    try {
      const doc = await this.findDoc(id)
      const result = await this.atomicUpdate<T>(doc, data, external)
      return result.toJSON()
    } catch (e) {
      this.dispatchWriteError('update', e)
      throw e
    }
  }

  public async delete(id: string) {
    try {
      const doc = await this.findOne(id).exec()
      if (doc) {
        await doc.remove()
      }
      return id
    } catch (e) {
      this.dispatchWriteError('delete', e)
      throw e
    }
  }

  public allAttachments = async (id: string) => {
    const doc = await this.findDoc(id)

    try {
      return doc.allAttachments()
    } catch {
      return [] // RxDB throws an error if there aren't any attachments
    }
  }

  public putAttachment = async (
    id: string,
    attachment: RxAttachmentCreator
  ) => {
    try {
      const doc = await this.findDoc(id)
      return doc.putAttachment(attachment)
    } catch (e) {
      this.dispatchWriteError('putAttachment', e)
      throw e
    }
  }

  public getAttachment = async (id: string, attachmentID: string) => {
    const doc = await this.findDoc(id)

    const attachment = doc.getAttachment(attachmentID)

    if (!attachment) {
      throw new Error('Attachment not found')
    }

    return attachment
  }

  public getAttachmentAsString = async (
    id: string,
    attachmentID: string
  ): Promise<string | undefined> => {
    const attachment = await this.getAttachment(id, attachmentID)

    return attachment ? attachment.getStringData() : undefined
  }

  public getAttachmentAsBlob = async (
    id: string,
    attachmentID: string
  ): Promise<Blob | undefined> => {
    const attachment = await this.getAttachment(id, attachmentID)

    return attachment ? attachment.getData() : undefined
  }

  public removeAttachment = async (id: string, attachmentID: string) => {
    try {
      const attachment = await this.getAttachment(id, attachmentID)
      return attachment.remove()
    } catch (e) {
      this.dispatchWriteError('removeAttachment', e)
      throw e
    }
  }

  public async bulkCreate(
    models: Array<Build<T> & ContainerIDs & ModelAttachment>
  ): Promise<Array<BulkDocsSuccess | BulkDocsError>> {
    const requiredFields = this.requiredFields()

    // save the models
    const items: T[] = []

    for (const model of models) {
      const { attachment, ...data } = model

      const item = {
        ...data,
        ...requiredFields,
      }

      items.push(item as T & ContainerIDs)
    }

    const results = await this.bulkDocs(items)

    // attach attachments
    for (const model of models) {
      if (model.attachment) {
        await this.putAttachment(model._id, model.attachment)
      }
    }

    return results
  }

  public async hasUnsyncedChanges() {
    if (!this.bucketName) {
      return false
    }

    const syncErrors = await this.conflictManager!.getSyncErrors()
    if (syncErrors && syncErrors.length) {
      return true
    }

    const remote = this.getRemoteUrl()

    try {
      const id = await generateReplicationID(
        this.collection!.pouch,
        new PouchDB(remote, {
          adapter: 'http',
        }),
        {}
      )
      const localSyncDoc = await this.collection!.pouch.get(id)
      const { last_seq } = localSyncDoc
      const changes = await this.collection!.pouch.changes({ since: last_seq })
      return !!changes.results.length
    } catch (e) {
      return true
    }
  }

  public async cleanupAndDestroy() {
    // fire-and-forget. Errors will be dispatched the Store
    // eslint-disable-next-line promise/valid-params
    try {
      await this.syncOnce('pull', { live: false, retry: false })
      if (await this.hasUnsyncedChanges()) {
        await this.syncOnce('push', { live: false, retry: false })
      }
      this.cancelReplications()
      // TODO: destroy the collection
      // this is only needed to free up memory
      // doing this now causes a conflict in MPUserProject the next
      // time the project is opened, so apparently some writing is still
      // happening while the project is being closed
      // if (this.collection) {
      //   await this.collection.destroy()
      // }
      this.store &&
        this.store.dispatch(actions.close(this.collectionName, true))
      return true
    } catch (e) {
      this.store &&
        this.store.dispatch(actions.close(this.collectionName, false))
      return false
    }
  }

  private bulkDocs(
    docs: Array<T & ContainerIDs>
  ): Promise<Array<BulkDocsSuccess | BulkDocsError>> {
    return this.getCollection().pouch.bulkDocs(docs)
  }

  private openCollection = async (name: string): Promise<RxCollection<T>> => {
    const { db } = this.props

    // remove suffix of project data collection name
    const definitionName = name.replace(/_.+/, '')

    const collection = db[name]

    return (
      collection || db.collection<T>({ ...collections[definitionName], name })
    )
  }

  private cancelReplication = async (replication: RxReplicationState) => {
    try {
      await replication.cancel()
    } catch (error) {
      this.dispatchSyncError('unknown', error)
    }
  }

  private get bucketName() {
    switch (this.collectionName) {
      case 'collaborators':
        return config.buckets.derived_data

      default:
        return config.buckets.projects
    }
  }

  private sync(
    direction: Direction,
    options: PouchReplicationOptions & { fetch?: Fetch } = {},
    isRetry = false
  ): RxReplicationState {
    if (direction === 'pull') {
      if (this.props.channels && this.props.channels.length) {
        options.query_params = {
          filter: 'sync_gateway/bychannel',
          channels: this.props.channels,
        }
      }
    }

    options.fetch = fetchWithCredentials

    const remote = this.getRemoteUrl()

    const replicationState = this.getCollection().sync({
      remote,
      waitForLeadership: false,
      direction: {
        pull: direction === 'pull',
        push: direction === 'push',
      },
      options: {
        back_off_function: (delay: number) => {
          if (delay === 0) {
            return 4000 + Math.random() * 2000
          }
          return delay * 2
        },
        ...options,
      },
    })

    this.dispatchActivity(direction, true)
    // TODO - if we need this, debounce it? Too many updates for a centralized store
    // to handle
    // replicationState.active$.subscribe(value => {
    //   this.dispatchActivity(direction, value)
    // })

    // replicationState.alive$.subscribe((alive: boolean) => {
    //   // TODO: handle dead connection
    // })

    // When pouch tries to replicate multiple documents
    replicationState.change$.subscribe((changeInfo) => {
      const { docs, errors } = changeInfo

      this.conflictManager!.saveSyncState(errors, docs).catch((error) => {
        throw error
      })

      errors.forEach((e: PouchReplicationError) =>
        this.dispatchSyncError(direction, e)
      )
    })

    replicationState.complete$.subscribe(async (result) => {
      const completed = result && result.ok

      if (completed) {
        await this.cancelReplication(replicationState)
      }
    })

    // When pouch tries to replicate a single document
    replicationState.denied$.subscribe((error) => {
      this.conflictManager!.saveSyncState([error], []).catch((error) => {
        throw error
      })

      this.dispatchSyncError(direction, error)
    })

    replicationState.error$.subscribe(async (error: PouchReplicationError) => {
      try {
        await this.handleSyncError(error, direction)

        if (isRetry) {
          this.dispatchSyncError(direction, error)
        } else {
          // cancel this replication
          await this.cancelReplication(replicationState)
          this.sync(direction, options, true)
        }
      } catch (error) {
        this.dispatchSyncError(direction, error)
        // this.setStatus(direction, 'complete', true)
      }
    })

    return replicationState
  }

  private handleSyncError(error: PouchReplicationError, direction: Direction) {
    if (direction === 'push') {
      if (error.error === 'conflict' && error.result && error.result.errors) {
        const conflicts = error.result.errors
          .filter((e) => e.error === 'conflict')
          .map(({ id, rev }) => ({ id, rev }))

        return this.conflictManager!.handleConflicts(conflicts)
      }
    }

    throw error
  }

  private dispatchWriteError(type: string, error: Error) {
    if (this.store) {
      this.store.dispatch(actions.writeError(this.collectionName, type, error))
    } else {
      throw error
    }
  }

  private dispatchSyncError(
    direction: 'push' | 'pull' | 'unknown',
    error: PouchReplicationError
  ) {
    if (this.store) {
      this.store.dispatch(
        actions.syncError(this.collectionName, direction, error)
      )
    } else {
      throw error
    }
  }

  private dispatchActivity(direction: 'push' | 'pull', status: boolean) {
    if (this.store) {
      this.store.dispatch(
        actions.active(this.collectionName, direction, status)
      )
    }
  }

  private backupPush(options: PouchReplicationOptions) {
    return this.getCollection().sync({
      ...options,
      remote: this.getBackupUrl(),
      direction: {
        push: true,
        pull: false,
      },
    })
  }

  private backupPullOnce(options: PouchReplicationOptions) {
    return promisifyReplicationState(
      this.getCollection().sync({
        options,
        remote: this.getBackupUrl(),
        direction: {
          push: false,
          pull: true,
        },
      })
    )
  }

  private atomicUpdate = async <T extends Model>(
    prev: RxDocument<T>,
    data: Partial<T>,
    external = false
  ): Promise<RxDocument<T>> => {
    const update = this.prepareUpdate<T>(data, external)

    return prev.atomicUpdate((doc: RxDocument<T>) => {
      Object.entries(update).forEach(([key, value]) => {
        ;(doc as { [key: string]: any })[key] = value
      })

      return doc
    })
  }

  private prepareUpdate = <T extends Model>(
    data: Partial<T>,
    external = false
  ): Partial<T> => {
    // https://github.com/Microsoft/TypeScript/pull/13288

    const { _id, _rev, ...rest } = data as any

    return {
      ...rest,
      updatedAt: timestamp(),
      sessionID: external ? externalSessionID : sessionID,
    }
  }

  private broadcastPurge = (id: string, rev: string) => {
    if (config.backupReplication.path) {
      axios.post(this.getBackupUrl(), { [id]: [rev] }).catch((error) => {
        this.dispatchSyncError('unknown', error)
      })
    }
  }

  private getRemoteUrl = () => {
    return `${config.gateway.url}/${this.bucketName}`
  }

  private getBackupUrl = (): string => {
    if (!config.backupReplication.path) {
      throw new Error('Backup replication URL not configured')
    }

    const bucketPath =
      this.bucketName === 'projects' ? this.collectionName : this.bucketName

    return `${window.location.origin}${config.backupReplication.path}/${bucketPath}`
  }
}
