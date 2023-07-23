/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { Affiliation, Contributor } from '@manuscripts/json-schema'
import { UserProfileWithAvatar } from '@manuscripts/transform'

import imageFile from '../assets/melnitz.jpg'

export const affiliations: Map<string, Affiliation> = new Map([
  [
    'affiliation-1',
    {
      _id: 'affiliation-1',
      containerID: 'project-1',
      manuscriptID: 'manuscript-1',
      objectType: 'MPAffiliation' as const,
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
      objectType: 'MPAffiliation' as const,
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
    affiliations: ['affiliation-2'],
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
    affiliations: ['affiliation-2', 'affiliation-1'],
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
  createdAt: 0,
  updatedAt: 0,
}
