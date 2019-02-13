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
import imageFile from '../assets/melnitz.jpg'

export const people: UserProfileWithAvatar[] = [
  {
    _id: 'user-1',
    userID: 'user_1',
    objectType: 'MPUserProfile',
    bibliographicName: {
      _id: 'name-1',
      objectType: 'MPBibliographicName',
      given: 'Janine',
      family: 'Melnitz',
    },
    email: 'janine.melnitz@example.com',
    avatar: imageFile,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'user-2',
    userID: 'user_2',
    objectType: 'MPUserProfile',
    bibliographicName: {
      _id: 'name-2',
      objectType: 'MPBibliographicName',
      given: 'Peter',
      family: 'Venkman',
    },
    email: 'peter.venkman@example.com',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'user-3',
    userID: 'user_3',
    objectType: 'MPUserProfile',
    bibliographicName: {
      _id: 'name-3',
      objectType: 'MPBibliographicName',
      given: 'Egon',
      family: 'Spengler',
    },
    email: 'egon.spengler@example.com',
    createdAt: 0,
    updatedAt: 0,
  },
]
