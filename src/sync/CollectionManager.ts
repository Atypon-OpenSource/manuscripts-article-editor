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
import { Collection, CollectionProps } from './Collection'

class CollectionManager {
  private collections: Map<string, Collection<Model>> = new Map()

  public async createCollection<T extends Model>(
    props: CollectionProps
  ): Promise<Collection<T>> {
    if (this.collections.has(props.collection)) {
      return this.collections.get(props.collection) as Collection<T>
    }

    const collection = new Collection<T>(props)

    this.collections.set(props.collection, collection)

    await collection.initialize()

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

  public removeCollection(collection: CollectionName) {
    return this.collections.delete(collection)
  }
}

export default new CollectionManager()
