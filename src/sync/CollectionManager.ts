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

import { Model } from '@manuscripts/manuscripts-json-schema'
import { CollectionName } from '../collections'
import config from '../config'
import { refreshSyncSessions } from '../lib/api'
import { postWebkitMessage } from '../lib/native'
import { Collection, CollectionProps } from './Collection'
import { isUnauthorized } from './syncErrors'
import { CollectionEvent, CollectionEventListener } from './types'
import zombieCollections from './ZombieCollections'

class CollectionManager {
  private collections: Map<string, Collection<Model>> = new Map()
  private listeners: CollectionEventListener[] = []
  private isExpiredSyncGatewaySession: boolean = false

  public constructor() {
    window.restartSync = () => {
      this.restartAll().catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
    }
  }

  public async createCollection<T extends Model>(
    props: CollectionProps
  ): Promise<Collection<T>> {
    if (this.collections.has(props.collection)) {
      return this.collections.get(props.collection) as Collection<T>
    }

    const collection = new Collection<T>(props)

    this.collections.set(props.collection, collection)

    await collection.initialize()

    collection.addEventListener('all', this.generalListener)

    return collection
  }

  public getCollection<T extends Model>(
    collection: CollectionName
  ): Collection<T> {
    if (!this.collections.has(collection)) {
      throw new Error('Missing collection: ' + collection)
    }

    return this.collections.get(collection) as Collection<T>
  }

  public removeCollection(collectionName: CollectionName) {
    const collection = this.collections.get(collectionName)
    this.collections.delete(collectionName)

    if (!collection) {
      return
    }
    collection
      .cleanupAndDestroy()
      .then(result => {
        if (!result) zombieCollections.add(collection.props)
      })
      .catch(() => {
        zombieCollections.add(collection.props)
      })
  }

  public subscribe(listener: CollectionEventListener) {
    this.listeners.push(listener)
  }

  public async restartAll() {
    /* tslint:disable:no-console */
    for (const parts of this.collections) {
      const collection = parts[1]
      try {
        await collection.cancelReplications()
      } catch (error) {
        console.error(`Unable to stop replication`)
      }

      try {
        await collection.startSyncing()
      } catch (error) {
        console.error(`Unable to start replication`)
      }
    }
    /* tslint:enable:no-console */
  }

  public unsyncedCollections(): Promise<string[]> {
    // do ANY collections have unsynced changes?
    return Promise.all(
      Array.from(this.collections.entries()).map(([key, collection]) =>
        collection.hasUnsyncedChanges().then(result => (result ? key : null))
      )
    ).then(results => results.filter(Boolean) as string[])
  }

  public async pushCollections(collections: string[]) {
    /* tslint:disable:no-console */
    for (const key of collections) {
      const collection = this.collections.get(key)
      if (!collection) continue
      try {
        await collection.cancelReplications()
      } catch (error) {
        console.error(`Unable to stop replication`)
      }

      try {
        await collection.syncOnce('push')
      } catch (error) {
        console.error(`Unable to start replication`)
      }
    }
    /* tslint:enable:no-console */
  }

  private generalListener = (event: CollectionEvent) => {
    if (isUnauthorized(event)) {
      if (!this.isExpiredSyncGatewaySession) {
        this.isExpiredSyncGatewaySession = true

        if (config.native) {
          /* tslint:disable-next-line:no-console */
          console.info('Requesting the native client to refresh sync session…')
          postWebkitMessage('sync', {})
        } else {
          /* tslint:disable-next-line:no-console */
          console.info('Attempting to refresh sync session…')

          return refreshSyncSessions()
            .then(() => {
              this.isExpiredSyncGatewaySession = false
              return this.restartAll()
            })
            .catch(() => {
              // refreshing sync session failed.
              // pass the original event onto the listeners.
              this.listeners.forEach(listener => listener(event))
            })
        }
      }
      return
    }

    this.listeners.forEach(listener => listener(event))
  }
}

export default new CollectionManager()
