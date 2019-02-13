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
        title: 'Project 1',
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

    const result = [projects[2], projects[1], projects[0]].sort(
      projectListCompare
    )

    expect(result).toEqual(projects)
  })
})
