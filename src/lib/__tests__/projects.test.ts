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

import { projectListCompare } from '../projects'

const createdAt = (date: string) => Math.floor(new Date(date).getTime() / 1000)

describe('projects', () => {
  test('projectListCompare', () => {
    const roles = {
      owners: [],
      writers: [],
      viewers: [],
    }

    const projects: Project[] = [
      {
        _id: 'project-1a',
        objectType: 'MPProject',
        createdAt: createdAt('2018-01-28T08:00:00Z'),
        updatedAt: createdAt('2018-01-28T08:00:00Z'),
        ...roles,
      },
      {
        _id: 'project-1b',
        objectType: 'MPProject',
        title: 'Project 1',
        createdAt: createdAt('2018-01-22T08:00:00Z'),
        updatedAt: createdAt('2018-01-22T08:00:00Z'),
        ...roles,
      },
      {
        _id: 'project-2',
        objectType: 'MPProject',
        title: 'Project 2',
        createdAt: createdAt('2018-01-24T08:00:00Z'),
        updatedAt: createdAt('2018-01-26T08:00:00Z'),
        ...roles,
      },
    ]

    const result = [projects[0], projects[2], projects[1]].sort(
      projectListCompare
    )

    expect(result).toEqual(projects)
  })
})
