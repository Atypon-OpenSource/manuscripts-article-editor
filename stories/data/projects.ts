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

import { Project } from '@manuscripts/manuscripts-json-schema'

const projects: Project[] = [
  {
    _id: 'project-1',
    objectType: 'MPProject',
    title: 'An example project',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    owners: ['user_1'],
    writers: [],
    viewers: [],
  },

  {
    _id: 'project-2',
    objectType: 'MPProject',
    title: 'Another example project',
    createdAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    owners: ['user_3'],
    writers: ['user_1'],
    viewers: ['user_2'],
  },
  {
    _id: 'project-3',
    objectType: 'MPProject',
    createdAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    owners: ['user_2'],
    writers: [],
    viewers: ['user_1', 'user_3'],
  },
]

export default projects

export const project = projects[0]
