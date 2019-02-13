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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from 'rxdb'

export const buildUser = async (
  doc: RxDocument<UserProfile>
): Promise<UserProfileWithAvatar> => {
  const item = doc.toJSON() as UserProfileWithAvatar

  const attachment = await doc.getAttachment('image')

  if (attachment) {
    item.avatar = window.URL.createObjectURL(await attachment.getData())
  }

  return item
}

export const buildUserMap = async (docs: Array<RxDocument<UserProfile>>) => {
  const output: Map<string, UserProfileWithAvatar> = new Map()

  for (const doc of docs) {
    const item = await buildUser(doc)

    output.set(item.userID, item)
  }

  return output
}
