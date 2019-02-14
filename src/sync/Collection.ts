/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  // ContainedModel,
  handleConflicts,
  // isManuscriptModel,
  saveSyncState,
} from '@manuscripts/manuscript-editor'
import {
  Build,
  ModelAttachment,
  // isManuscriptModel,
  timestamp,
} from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import * as HttpStatusCodes from 'http-status-codes'
import {
  PouchDB,
  PouchReplicationOptions,
  RxAttachmentCreator,
  RxCollection,
  RxDocument,
  RxReplicationState,
} from 'rxdb'
import { CollectionName, collections } from '../collections'
import { Database } from '../components/DatabaseProvider'
import config from '../config'
import { refreshSyncSessions } from '../lib/api'
import sessionID from '../lib/session-id'
import {
  BulkDocsError,
  BulkDocsSuccess,
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

  public collectionName: string

  public replications: Replications = {
    pull: null,
    push: null,
  }

  public status: ReplicationStatus = { ...initialReplicationStatus }

  public listeners: EventListeners = {
    active: [],
    complete: [],
    error: [],
  }

  public constructor(props: CollectionProps) {
    this.collectionName = this.buildCollectionName(props.collection)
    this.props = props
  }

  public addEventListener(type: EventType, listener: CollectionEventListener) {
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

  public dispatchEvent(event: CustomEvent) {
    if (this.isSupportedEventType(event.type)) {
      for (const listener of this.listeners[event.type]) {
        listener(event)
      }
    }

    return false // the listeners don't call event.preventDefault
  }

  public async initialize(startSyncing = true) {
    this.collection = await this.openCollection(this.collectionName)

    const pouch = this.collection.pouch as PouchDB & EventEmitter
    pouch.setMaxListeners(50)

    this.status = { ...initialReplicationStatus }

    if (startSyncing) {
      this.startSyncing().catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
    }
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

  public async save(
    data: T | Partial<T> | Build<T>,
    ids?: ContainerIDs
  ): Promise<T> {
    const doc = await this.getCollection()
      .findOne(data._id)
      .exec()

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

    const result = await this.getCollection().insert(model)

    return result.toJSON()
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    const doc = await this.getCollection()
      .findOne(id)
      .exec()

    if (!doc) {
      throw new Error('Document not found')
    }

    const result = await this.atomicUpdate<T>(doc, data)

    return result.toJSON()
  }

  public async delete(id: string) {
    const doc = await this.getCollection()
      .findOne(id)
      .exec()

    if (!doc) {
      throw new Error('Document not found')
    }

    await doc.remove()

    return id
  }

  public async attach(id: string, attachment: RxAttachmentCreator) {
    const doc = await this.getCollection()
      .findOne(id)
      .exec()

    if (!doc) {
      throw new Error('Document not found')
    }

    await doc.putAttachment(attachment)
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
        await this.attach(model._id, model.attachment)
      }
    }

    return results
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

  private setStatus(direction: Direction, type: EventType, value: boolean) {
    // tslint:disable-next-line:no-console
    console.log('Sync', this.collectionName, {
      direction,
      type,
      value,
    })

    this.status[direction][type] = value

    this.dispatchEvent(
      new CustomEvent(type, {
        detail: { direction, value },
      })
    )
  }

  private syncOnce(
    direction: Direction,
    options: PouchReplicationOptions = {}
  ) {
    const replicationState = this.sync(direction, {
      ...options,
      live: false,
      retry: false,
    })

    this.replications[direction] = replicationState

    return new Promise((resolve, reject) => {
      replicationState.complete$.subscribe(async complete => {
        if (complete) {
          this.replications[direction] = null
          // successfully handled sync error but failed again, move on
          this.setStatus(direction, 'complete', true)
          resolve()
        }
      })

      replicationState.error$.subscribe(error => {
        if (error) {
          this.replications[direction] = null
          // successfully handled sync error but failed again, move on
          this.setStatus(direction, 'complete', true)
          reject(error)
        }
      })
    })
  }

  private sync(
    direction: Direction,
    options: PouchReplicationOptions & { fetch?: Fetch } = {},
    isRetry: boolean = false
  ) {
    if (this.replications[direction]) {
      throw new Error(
        `Existing ${direction} replication in progress for ${
          this.collectionName
        }`
      )
    }

    if (direction === 'pull') {
      if (this.props.channels) {
        options.query_params = {
          filter: 'sync_gateway/bychannel',
          channels: this.props.channels,
        }
      }
    }

    options.fetch = fetchWithCredentials

    // tslint:disable-next-line:no-console
    console.log(`Syncing ${this.collectionName}`, { direction, options })

    const replicationState = this.getCollection().sync({
      remote: config.gateway.url + '/projects',
      direction: {
        pull: direction === 'pull',
        push: direction === 'push',
      },
      options,
    })

    this.replications[direction] = replicationState

    // replicationState.alive$.subscribe((alive: boolean) => {
    //   // TODO: handle dead connection
    // })

    // replicationState.active$.subscribe((value: boolean) => {
    //   this.setStatus(direction, 'active', value)
    // })

    // When pouch tries to replicate multiple documents
    replicationState.change$.subscribe(changeInfo => {
      const { docs, errors } = changeInfo

      saveSyncState(this.getCollection(), errors, docs).catch(error => {
        throw error
      })
    })

    replicationState.complete$.subscribe(async result => {
      const completed = result && result.ok

      if (completed) {
        await this.cancelReplication(direction, replicationState)
      }
    })

    // When pouch tries to replicate a single document
    replicationState.denied$.subscribe(error => {
      saveSyncState(this.getCollection(), [error], []).catch(error => {
        throw error
      })
    })

    replicationState.error$.subscribe(async (error: PouchReplicationError) => {
      try {
        await this.handleSyncError(error, direction)

        if (isRetry) {
          // tslint:disable-next-line:no-console
          console.warn(
            `${this.collectionName} ${direction} sync failed, giving up`
          )

          this.setStatus(direction, 'error', true)
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

        this.setStatus(direction, 'error', true)
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

        return handleConflicts(this.getCollection(), conflicts)
      }
    }

    switch (error.status) {
      // unauthorized, start a new sync gateway session if signed in
      case HttpStatusCodes.UNAUTHORIZED:
        // TODO: only do this once
        // tslint:disable-next-line:no-console
        console.info('Refreshing sync session')
        return refreshSyncSessions()

      default:
        throw error
    }
  }

  private atomicUpdate = async <T extends Model>(
    prev: RxDocument<T>,
    data: Partial<T>
  ): Promise<RxDocument<T>> => {
    const update = this.prepareUpdate<T>(data)

    // tslint:disable-next-line:no-any
    return prev.atomicUpdate((doc: RxDocument<T> & { [key: string]: any }) => {
      Object.entries(update).forEach(([key, value]) => {
        doc[key] = value
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
}
