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
