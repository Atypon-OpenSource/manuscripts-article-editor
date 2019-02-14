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

import { timestamp } from '@manuscripts/manuscript-transform'
import { Keyword, ObjectTypes } from '@manuscripts/manuscripts-json-schema'

export const keywords: Keyword[] = [
  {
    _id: 'keyword-1',
    name: 'Keyword One',
    objectType: ObjectTypes.Keyword,
    containerID: 'project-1',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
  {
    _id: 'keyword-2',
    name: 'Keyword Two',
    objectType: ObjectTypes.Keyword,
    containerID: 'project-2',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
]
