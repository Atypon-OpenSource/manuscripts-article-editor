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

import { RxDatabase } from '@manuscripts/rxdb'
import BroadcastChannel from 'broadcast-channel'

import { Collection, CollectionProps } from './Collection'

type SerializableCollectionProps = Pick<
  CollectionProps,
  'channels' | 'collection'
>

export class ZombieCollections {
  private collections: SerializableCollectionProps[]
  private channel: BroadcastChannel

  constructor(
    channel: BroadcastChannel,
    initialValue?: SerializableCollectionProps[]
  ) {
    this.collections = initialValue || []
    this.channel = channel

    this.channel.onmessage = (msg) => {
      this.collections = JSON.parse(msg)
    }
  }

  public getCollections() {
    return this.collections
  }

  public add(collection: CollectionProps) {
    this.collections.push({
      collection: collection.collection,
      channels: collection.channels,
    })
    this.postState()
    return this
  }

  public remove(collection: string) {
    this.collections = this.collections.filter(
      (item) => item.collection !== collection
    )
    this.postState()
    return this
  }

  public getOne() {
    return this.collections[0] || null
  }

  public async cleanupOne(
    props: SerializableCollectionProps,
    db: RxDatabase
  ): Promise<boolean> {
    const collection = new Collection({ ...props, db })

    try {
      await collection.initialize(false)
      const result = await collection.cleanupAndDestroy()
      this.remove(props.collection)
      return result
    } catch (e) {
      return false
    }
  }

  public cleanupAll(db: RxDatabase): Promise<boolean> {
    return Promise.all(
      this.collections.map((collection) => {
        return this.cleanupOne(collection, db)
      })
    ).then((results: boolean[]) => results.includes(false))
  }

  private postState() {
    this.channel
      .postMessage(JSON.stringify(this.getCollections()))
      .catch((e) => {
        console.error('Error while broadcasting sync state between tabs', e)
      })
  }
}

export default new ZombieCollections(new BroadcastChannel('zombies'))
