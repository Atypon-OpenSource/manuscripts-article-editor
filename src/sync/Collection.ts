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
import { cloneDeep } from 'lodash-es'
import generateReplicationID from 'pouchdb-generate-replication-id'
import { CollectionName, collections } from '../collections'
import { Database } from '../components/DatabaseProvider'
import config from '../config'
import sessionID from '../lib/session-id'
import { onIdle } from './onIdle'
import {
  BulkDocsError,
  BulkDocsSuccess,
  CollectionEvent,
  CollectionEventDetails,
  CollectionEventListener,
  Direction,
  EventListeners,
  EventType,
  PouchReplicationError,
  Replications,
  ReplicationStatus,
} from './types'

export const initialReplicationStatus = {
  pull: {
    active: false,
    complete: false,
    error: false,
  },
  push: {
    active: false,
    complete: false,
    error: false,
  },
}

export interface ContainerIDs {
  containerID?: string
  manuscriptID?: string
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
    replicationState.complete$.subscribe(async complete => {
      if (complete) {
        resolve()
      }
    })

    replicationState.error$.subscribe(error => {
      if (error) {
        reject(error)
      }
    })
  })

const fetchWithCredentials: Fetch = (url, opts = {}) =>
  // tslint:disable-next-line:no-any (PouchDB/RxDB typing needs fetch)
  (PouchDB as any).fetch(url, {
    ...opts,
    credentials: 'include',
  })

export interface CollectionProps {
  collection: CollectionName
  channels?: string[]
  db: Database
}

export class Collection<T extends Model> implements EventTarget {
  public props: CollectionProps

  public collection?: RxCollection<T>
  public conflictManager?: ConflictManager

  public collectionName: string

  public replications: Replications = {
    pull: null,
    push: null,
  }

  public status: ReplicationStatus = cloneDeep(initialReplicationStatus)

  public listeners: EventListeners = {
    active: [],
    complete: [],
    error: [],
  }

  private eventTypes: EventType[] = ['active', 'complete', 'error']

  private idleHandlerCleanup?: () => void

  public constructor(props: CollectionProps) {
    this.collectionName = this.buildCollectionName(props.collection)
    this.props = props
  }

  public addEventListener(
    type: EventType | 'all',
    listener: CollectionEventListener
  ) {
    if (type === 'all') {
      this.eventTypes.forEach((eventType: EventType) =>
        this.listeners[eventType].push(listener)
      )
      return
    }
    this.listeners[type].push(listener)
  }

  public removeEventListener(
    type: EventType,
    listener: CollectionEventListener
  ) {
    this.listeners[type] = this.listeners[type].filter(
      item => item !== listener
    )
  }

  public dispatchEvent(event: CollectionEvent) {
    if (this.isSupportedEventType(event.type)) {
      for (const listener of this.listeners[event.type]) {
        listener(event)
      }
    }

    return false // the listeners don't call event.preventDefault
  }

  public async initialize(startSyncing = true) {
    this.collection = await this.openCollection(this.collectionName)

    this.collection.preRemove(plainData => {
      plainData.sessionID = sessionID
    }, false)

    this.conflictManager = new ConflictManager(
      this.collection as RxCollection<Model>,
      this.broadcastPurge
    )

    const pouch = this.collection.pouch as PouchDB & EventEmitter
    pouch.setMaxListeners(50)

    this.status = cloneDeep(initialReplicationStatus)

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
      this.startSyncing()
        .then(() => {
          // cancel replications in idle tabs to save resources and allow new tabs
          // to connect
          this.idleHandlerCleanup = onIdle(
            () => {
              if (
                this.status.push.active ||
                this.status.pull.active ||
                !this.status.pull.complete
              ) {
                return false
              }

              console.log('Idle, canceling replication', this.status) // tslint:disable-line:no-console

              this.cancelReplications().catch(error => {
                console.error(`Unable to stop replication`, error) // tslint:disable-line:no-console
              })

              return true
            },
            () => {
              if (this.replications.push || this.replications.pull) {
                return false
              }

              console.log('Active, resuming replication', this.replications) // tslint:disable-line:no-console

              this.startSyncing().catch(error => {
                console.error(`Unable to start syncing`, error) // tslint:disable-line:no-console
              })

              return true
            }
          )
        })
        .catch(error => {
          console.error(error) // tslint:disable-line:no-console
        })
    } else {
      this.setStatus('pull', 'complete', true)
      this.setStatus('push', 'complete', true)
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

    this.replications[direction] = replicationState

    return promisifyReplicationState(replicationState)
      .then(() => {
        this.replications[direction] = null
        this.setStatus(direction, 'complete', true)
      })
      .catch(err => {
        this.replications[direction] = null
        // successfully handled sync error but failed again, move on
        this.setStatus(direction, 'complete', true)
        return Promise.reject(err)
      })
  }

  public async startSyncing() {
    // TODO: need to know if initial push failed?
    // await this.syncOnce('push')

    // wait for initial pull of data to finish
    // TODO: allow cancel, in case of slow connection?
    await this.syncOnce('pull')

    // start ongoing pull sync
    this.sync('pull', {
      live: true,
      retry: true,
    })

    // start ongoing push sync
    this.sync('push', {
      live: true,
      retry: true,
    })
  }

  public cancelReplications = () =>
    Promise.all(
      Object.entries(this.replications).map(
        async ([direction, replicationState]) => {
          if (replicationState) {
            await this.cancelReplication(
              direction as Direction,
              replicationState
            )
          }
        }
      )
    )

  public ensurePushSync = async () => {
    try {
      if (this.replications.push) {
        await this.cancelReplication('push', this.replications.push)
      }

      const replicationState = this.sync('push', { live: false, retry: false })

      if (!replicationState) {
        throw new Error(`Unable to push ${this.collectionName}`)
      }

      this.sync('push', { live: true, retry: true })

      return promisifyReplicationState(replicationState)
    } catch (error) {
      throw new Error(`Unable to ensure push sync of ${this.collectionName}`)
    }
  }

  public getCollection(): RxCollection<T> {
    if (!this.collection) {
      throw new Error('Collection not initialized')
    }

    return this.collection
  }

  public find(queryObj: object) {
    return this.getCollection().find(queryObj)
  }

  public findOne(queryObj: string | object) {
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
    ids?: ContainerIDs
  ): Promise<T> {
    const doc = data._id ? await this.findOne(data._id).exec() : null

    return doc
      ? this.update(doc._id, data as Partial<T>)
      : this.create(data as Build<T>, ids)
  }

  public requiredFields(): Partial<Model> {
    const createdAt = timestamp()

    return {
      createdAt,
      updatedAt: createdAt,
      sessionID,
    }
  }

  public async create(data: Build<T>, ids?: ContainerIDs) {
    const model: T = {
      ...(data as T),
      ...this.requiredFields(),
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

  public async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const doc = await this.findDoc(id)
      const result = await this.atomicUpdate<T>(doc, data)
      return result.toJSON()
    } catch (e) {
      this.dispatchWriteError('update', e)
      throw e
    }
  }

  public async delete(id: string) {
    try {
      const doc = await this.findDoc(id)
      await doc.remove()
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
    if (!this.bucketName) return false

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
    try {
      if (await this.hasUnsyncedChanges()) {
        await this.syncOnce('push', { live: false, retry: false })
      }
      await this.cancelReplications()
      // TODO: destroy the collection
      // this is only needed to free up memory
      // doing this now causes a conflict in MPUserProject the next
      // time the project is opened, so apparently some writing is still
      // happening while the project is being closed
      // if (this.collection) {
      //   await this.collection.destroy()
      // }
      this.idleHandlerCleanup && this.idleHandlerCleanup()
      return true
    } catch (e) {
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

  // TODO: hash?
  private buildCollectionName = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9_]/g, '_')

  private cancelReplication = async (
    direction: Direction,
    replication: RxReplicationState
  ) => {
    try {
      await replication.cancel()
      this.replications[direction] = null
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
    }
  }

  private isSupportedEventType(type: string): type is EventType {
    return type in this.listeners
  }

  private setStatus(
    direction: Direction,
    type: EventType,
    value: boolean,
    error?: Error | AxiosError | PouchReplicationError
  ) {
    // tslint:disable-next-line:no-console
    console.log('Sync', this.collectionName, {
      direction,
      type,
      value,
    })

    this.status[direction][type] = value

    this.dispatchEvent(
      new CustomEvent<CollectionEventDetails>(type, {
        detail: { direction, value, error, collection: this.collectionName },
      })
    )
  }

  private dispatchSyncError(
    direction: Direction,
    options: PouchReplicationOptions,
    error?: Error | AxiosError | PouchReplicationError
  ) {
    this.dispatchEvent(
      new CustomEvent<CollectionEventDetails>('error', {
        detail: {
          direction,
          value: true,
          error,
          collection: this.collectionName,
          isLive: options.live,
        },
      })
    )
  }

  private dispatchWriteError(operation: string, error: Error) {
    this.dispatchEvent(
      new CustomEvent<CollectionEventDetails>('error', {
        detail: {
          operation,
          value: true,
          error,
          collection: this.collectionName,
        },
      })
    )
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
    isRetry: boolean = false
  ): RxReplicationState | false {
    if (this.replications[direction]) {
      throw new Error(
        `Existing ${direction} replication in progress for ${this.collectionName}`
      )
    }

    if (direction === 'pull') {
      if (this.props.channels) {
        if (!this.props.channels.length) {
          // tslint:disable-next-line:no-console
          console.warn('No channels were provided for a filtered sync')
          this.setStatus(direction, 'complete', true)
          return false
        }

        options.query_params = {
          filter: 'sync_gateway/bychannel',
          channels: this.props.channels,
        }
      }
    }

    options.fetch = fetchWithCredentials

    const remote = this.getRemoteUrl()

    // tslint:disable-next-line:no-console
    console.log(`Syncing ${this.collectionName}`, {
      direction,
      options,
      remote,
    })

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

    this.replications[direction] = replicationState

    replicationState.active$.subscribe(value => {
      this.setStatus(direction, 'active', value)
    })

    // replicationState.alive$.subscribe((alive: boolean) => {
    //   // TODO: handle dead connection
    // })

    // When pouch tries to replicate multiple documents
    replicationState.change$.subscribe(changeInfo => {
      const { docs, errors } = changeInfo

      this.conflictManager!.saveSyncState(errors, docs).catch(error => {
        throw error
      })

      errors.forEach((e: PouchReplicationError) =>
        this.dispatchSyncError(direction, options, e)
      )
    })

    replicationState.complete$.subscribe(async result => {
      const completed = result && result.ok

      if (completed) {
        await this.cancelReplication(direction, replicationState)
      }
    })

    // When pouch tries to replicate a single document
    replicationState.denied$.subscribe(error => {
      this.conflictManager!.saveSyncState([error], []).catch(error => {
        throw error
      })

      this.dispatchSyncError(direction, options, error)
    })

    replicationState.error$.subscribe(async (error: PouchReplicationError) => {
      try {
        await this.handleSyncError(error, direction)

        if (isRetry) {
          // tslint:disable-next-line:no-console
          console.warn(
            `${this.collectionName} ${direction} sync failed, giving up`
          )

          this.setStatus(direction, 'error', true, error)
        } else {
          // cancel this replication
          await this.cancelReplication(direction, replicationState)

          // tslint:disable-next-line:no-console
          console.warn(
            `${this.collectionName} ${direction} sync failed, retrying`
          )

          // try once more, after refreshing the sync session
          this.sync(direction, options, true)
        }
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(`${this.collectionName} ${direction} sync failed:`, error)

        this.setStatus(direction, 'error', true, error)
        // this.setStatus(direction, 'complete', true)
      }
    })

    return replicationState
  }

  private handleSyncError(error: PouchReplicationError, direction: Direction) {
    console.error(error) // tslint:disable-line:no-console

    if (direction === 'push') {
      if (error.error === 'conflict' && error.result && error.result.errors) {
        const conflicts = error.result.errors
          .filter(e => e.error === 'conflict')
          .map(({ id, rev }) => ({ id, rev }))

        return this.conflictManager!.handleConflicts(conflicts)
      }
    }

    throw error
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
    data: Partial<T>
  ): Promise<RxDocument<T>> => {
    const update = this.prepareUpdate<T>(data)

    return prev.atomicUpdate((doc: RxDocument<T>) => {
      Object.entries(update).forEach(([key, value]) => {
        // tslint:disable-next-line:no-any
        ;(doc as { [key: string]: any })[key] = value
      })

      return doc
    })
  }

  private prepareUpdate = <T extends Model>(data: Partial<T>): Partial<T> => {
    // https://github.com/Microsoft/TypeScript/pull/13288
    // tslint:disable-next-line:no-any
    const { _id, _rev, ...rest } = data as any

    return {
      ...rest,
      updatedAt: timestamp(),
      sessionID,
    }
  }

  private broadcastPurge = (id: string, rev: string) => {
    if (config.backupReplication.path) {
      axios.post(this.getBackupUrl(), { [id]: [rev] }).catch(error => {
        console.error(error) // tslint:disable-line:no-console
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
