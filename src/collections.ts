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

import { RxCollection, RxCollectionCreator } from 'rxdb'

// `string` has to be allowed for e.g. project-${projectID}
export type CollectionName =
  // | 'projects'
  | 'user'
  | 'collaborators'
  // | 'invitations'
  | string

type CollectionCreators = { [key in CollectionName]: RxCollectionCreator }

export type Collections = { [key in CollectionName]: RxCollection }

const basicProperties = {
  _id: {
    type: 'string',
    primary: true,
  },
  objectType: {
    type: 'string',
    index: true,
  },
  createdAt: {
    type: 'number',
    index: true,
  },
  updatedAt: {
    type: 'number',
    index: true,
  },
}

export const collections: CollectionCreators = {
  /*projects: {
    name: 'projects',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
    },
  },*/
  user: {
    name: 'user',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },
  collaborators: {
    name: 'collaborators',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },
  /*invitations: {
    name: 'invitations',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },*/
  project: {
    name: 'project',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },
}
