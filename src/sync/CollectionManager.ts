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
