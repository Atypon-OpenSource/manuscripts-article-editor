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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Affiliation, Contributor } from '@manuscripts/manuscripts-json-schema'
import imageFile from '../assets/melnitz.jpg'

export const affiliations: Map<string, Affiliation> = new Map([
  [
    'affiliation-1',
    {
      _id: 'affiliation-1',
      containerID: 'project-1',
      manuscriptID: 'manuscript-1',
      objectType: 'MPAffiliation' as 'MPAffiliation',
      institution: 'Firehouse, Hook & Ladder Company 8',
      priority: 0,
      sessionID: 'story',
      createdAt: 0,
      updatedAt: 0,
    },
  ],
  [
    'affiliation-2',
    {
      _id: 'affiliation-2',
      containerID: 'project-1',
      manuscriptID: 'manuscript-1',
      objectType: 'MPAffiliation' as 'MPAffiliation',
      institution: 'Firehouse, Hook & Ladder Company 9',
      priority: 0,
      sessionID: 'story',
      createdAt: 0,
      updatedAt: 0,
    },
  ],
])

export const authors: Contributor[] = [
  {
    _id: 'example-1',
    containerID: 'project-1',
    manuscriptID: 'manuscript-1',
    objectType: 'MPContributor',
    priority: 1,
    role: 'author',
    bibliographicName: {
      _id: 'name-1',
      objectType: 'MPBibliographicName',
      given: 'Janine',
      family: 'Melnitz',
    },
    email: 'janine.melnitz@example.com',
    affiliations: ['affiliation-1'],
    sessionID: 'story',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'example-2',
    containerID: 'project-1',
    manuscriptID: 'manuscript-1',
    objectType: 'MPContributor',
    priority: 2,
    role: 'author',
    bibliographicName: {
      _id: 'name-2',
      objectType: 'MPBibliographicName',
      given: 'Peter',
      family: 'Venkman',
    },
    email: 'peter.venkman@example.com',
    affiliations: ['affiliation-1', 'affiliation-2'],
    sessionID: 'story',
    createdAt: 0,
    updatedAt: 0,
    isCorresponding: true,
  },
  {
    _id: 'example-3',
    containerID: 'project-1',
    manuscriptID: 'manuscript-1',
    objectType: 'MPContributor',
    priority: 3,
    role: 'author',
    bibliographicName: {
      _id: 'name-3',
      objectType: 'MPBibliographicName',
      given: 'Dana',
      family: 'Barrett',
    },
    email: 'dana.barrett@example.com',
    affiliations: ['affiliation-1'],
    sessionID: 'story',
    createdAt: 0,
    updatedAt: 0,
  },
]

export const user: UserProfileWithAvatar = {
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
  affiliations: ['affiliation-1'],
  sessionID: 'story',
  createdAt: 0,
  updatedAt: 0,
}
