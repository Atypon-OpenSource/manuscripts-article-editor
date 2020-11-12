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
import { Database } from '../components/DatabaseProvider'
import config from '../config'
import { Collection, CollectionProps } from './Collection'
import { onIdle } from './onIdle'
import { actions, selectors } from './syncEvents'
import { Store } from './SyncStore'

const { local } = config

const NullStore = () => ({
  dispatch: () => {
    return
  },
  getState: () => {
    return {}
  },
})

class CollectionManager {
  private collections: Map<string, Collection<Model>> = new Map()
  private store: Store
  private db?: Database

  public constructor() {
    this.store = NullStore()
    window.restartSync = () => {
      return this.restartAll()
    }
    onIdle(
      () => {
        this.collections.forEach((collection) => {
          // eslint-disable-next-line promise/valid-params
          collection.cancelReplications()
        })
        return true
      },
      () => {
        this.collections.forEach((collection) => {
          // eslint-disable-next-line promise/valid-params
          collection.startSyncing().catch((err) => {
            this.store.dispatch(
              actions.syncError(collection.collectionName, 'pull', err)
            )
          })
        })
        return true
      }
    )
  }

  public listen(store: Store) {
    this.store = store
  }

  public unlisten() {
    this.store = NullStore()
  }

  public async createCollection<T extends Model>(
    props: CollectionProps
  ): Promise<Collection<T>> {
    if (!this.db) {
      this.db = props.db
    }

    const collection = new Collection<T>(props, this.store)
    this.collections.set(props.collection, collection as Collection<Model>)

    await collection.initialize(!local)

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
    if (!collection) {
      return
    }
    // swallow at catch, all possible errors are handled within cleanupAndDestroy
    collection.cleanupAndDestroy().catch((err) => {
      this.store.dispatch(actions.syncError(collectionName, 'unknown', err))
    })
  }

  public restartAll() {
    // fire-and-forget: Errors will bubble into the sync store
    // eslint-disable-next-line promise/valid-params
    ;(async () => {
      this.store.dispatch(actions.resetErrors())

      await this.pushCollections(['user'])
      for (const parts of this.collections) {
        const collection = parts[1]
        await collection.cancelReplications()
        await collection.startSyncing()
      }
    })().catch()
  }

  public unsyncedCollections(): Promise<string[]> {
    // do ANY collections have unsynced changes?
    return Promise.all(
      Array.from(this.collections.entries()).map(([key, collection]) =>
        collection.hasUnsyncedChanges().then((result) => (result ? key : null))
      )
    ).then((results) => results.filter(Boolean) as string[])
  }

  public async pushCollections(collections: string[]) {
    for (const key of collections) {
      const collection = this.collections.get(key)
      if (!collection) {
        continue
      }
      await collection.cancelReplications()
      await collection.syncOnce('pull')
      await collection.syncOnce('push')
    }
  }

  public cleanupAndDestroyAll() {
    const state = this.store.getState()
    return Promise.all(
      selectors
        .notClosed(state)
        .map((collectionName) =>
          this.getCollection(collectionName).cleanupAndDestroy()
        )
    )
  }

  public async killOneZombie() {
    const state = this.store.getState()
    const collectionName = selectors.oneZombie(state)
    if (!collectionName) {
      return
    }
    if (this.collections.has(collectionName)) {
      this.getCollection(collectionName).cleanupAndDestroy()
    } else if (this.db) {
      const { meta } = state[collectionName]!
      const collection = new Collection({
        collection: collectionName,
        channels: meta.channels,
        db: this.db,
      })
      await collection.initialize(false)
      await collection.cleanupAndDestroy()
    }
  }
}

const collectionManager = new CollectionManager()

const RESYNC_RATE = 15 * 1000

setInterval(() => collectionManager.killOneZombie(), RESYNC_RATE)

export default collectionManager
