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
import { RxDocument } from 'rxdb'

export const newestFirst = (a: RxDocument<Model>, b: RxDocument<Model>) =>
  Number(b.createdAt) - Number(a.createdAt)

export const oldestFirst = (a: RxDocument<Model>, b: RxDocument<Model>) =>
  Number(a.createdAt) - Number(b.createdAt)
