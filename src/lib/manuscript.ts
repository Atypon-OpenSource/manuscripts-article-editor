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
