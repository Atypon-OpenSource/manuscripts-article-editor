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

import { Collections } from '../collections'
import { adapter } from './adapter'
import RxDB from './rxdb'

const createDatabase = () =>
  RxDB.create<Collections>({
    name: 'manuscriptsdb',
    adapter,
    // queryChangeDetection: true,
  })

export let databaseCreator = (() => {
  try {
    return createDatabase()
  } catch (e) {
    return Promise.reject(e)
  }
})()

export const removeDatabase = async () => {
  const db = await databaseCreator

  await db.destroy()
  await db.remove()
}

export const recreateDatabase = async () => {
  await removeDatabase()

  databaseCreator = createDatabase()

  return databaseCreator
}
