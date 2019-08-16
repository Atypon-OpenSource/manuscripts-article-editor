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
