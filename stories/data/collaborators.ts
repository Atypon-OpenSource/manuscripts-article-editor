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
  ObjectTypes,
  UserCollaborator,
} from '@manuscripts/manuscripts-json-schema'
import { people } from './people'

export const collaborators: UserCollaborator[] = people.map(
  (collaboratorProfile, index) => {
    const objectType = ObjectTypes.UserCollaborator
    const collaboratorID = `${objectType}:${index}`

    return {
      _id: collaboratorID,
      objectType: objectType as 'MPUserCollaborator',
      collaboratorID,
      collaboratorProfile,
      userID: 'MPUserProfile:1',
      projects: [],
      createdAt: 0,
      updatedAt: 0,
    }
  }
)
