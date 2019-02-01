import {
  Manuscript,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import { Collection } from '../sync/Collection'

export const isManuscript = (model: Model): model is Manuscript =>
  model.objectType === ObjectTypes.Manuscript

export const nextManuscriptPriority = async (
  collection: Collection<Manuscript>
): Promise<number> => {
  const docs = await collection
    .collection!.find({
      objectType: ObjectTypes.Manuscript,
    })
    .exec()

  const manuscripts = docs.map(doc => doc.toJSON())

  const priority: number = manuscripts.length
    ? Math.max(...manuscripts.map(manuscript => manuscript.priority || 1))
    : 0

  return priority + 1
}
