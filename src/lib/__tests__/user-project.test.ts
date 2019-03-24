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

import { Project, UserProject } from '@manuscripts/manuscripts-json-schema'
import { buildRecentProjects, buildUserProject } from '../user-project'

describe('user project', () => {
  test('buildUserProject', () => {
    expect(
      buildUserProject('User_id', 'MPProject:id', 'MPManuscript:id', 'deviceId')
        .lastOpened.deviceId.manuscriptID
    ).toBe('MPManuscript:id')
  })

  test('buildRecentProjects', () => {
    const userProjects: UserProject[] = [
      {
        _id: 'MPUserProject:id1',
        createdAt: 123123123,
        updatedAt: 123123123,
        lastOpened: {
          deviceId: {
            manuscriptID: 'MPManuscript:id1',
            timestamp: 123123129,
          },
        },
        objectType: 'MPUserProject',
        projectID: 'MPProject:id1',
        userID: 'User_id',
      },
      {
        _id: 'MPUserProject:id2',
        createdAt: 123123123,
        updatedAt: 123123123,
        lastOpened: {
          deviceId: {
            manuscriptID: 'MPManuscript:id1',
            timestamp: 123123123,
          },
        },
        objectType: 'MPUserProject',
        projectID: 'MPProject:id2',
        userID: 'User_id',
      },
      {
        _id: 'MPUserProject:id4',
        createdAt: 123123123,
        updatedAt: 123123123,
        lastOpened: {
          deviceId: {
            manuscriptID: 'MPManuscript:id3',
            timestamp: 123123128,
          },
        },
        objectType: 'MPUserProject',
        projectID: 'MPProject:id2',
        userID: 'User_id',
      },
      {
        _id: 'MPUserProject:id5',
        createdAt: 123123123,
        updatedAt: 123123123,
        lastOpened: {
          deviceId: {
            manuscriptID: 'MPManuscript:id2',
            timestamp: 123123128,
          },
        },
        objectType: 'MPUserProject',
        projectID: 'MPProject:id2',
        userID: 'User_id',
      },
      {
        _id: 'MPUserProject:id3',
        createdAt: 123123123,
        updatedAt: 123123123,
        lastOpened: {
          deviceId: {
            manuscriptID: 'MPManuscript:id1',
            timestamp: 123123123,
          },
        },
        objectType: 'MPUserProject',
        projectID: 'MPProject:id3',
        userID: 'User_id',
      },
    ]

    const projects: Project[] = [
      {
        _id: 'MPProject:id1',
        createdAt: 123123123,
        objectType: 'MPProject',
        owners: [],
        writers: [],
        viewers: [],
        updatedAt: 123123123,
      },
      {
        _id: 'MPProject:id2',
        createdAt: 123123123,
        objectType: 'MPProject',
        title: 'Project 2',
        owners: [],
        writers: [],
        viewers: [],
        updatedAt: 123123123,
      },
      {
        _id: 'MPProject:id3',
        createdAt: 123123123,
        objectType: 'MPProject',
        title: 'Project 3',
        owners: [],
        writers: [],
        viewers: [],
        updatedAt: 123123123,
      },
    ]

    const recentProjects = buildRecentProjects(
      'MPProject:id3',
      userProjects,
      projects,
      'deviceId'
    )

    const expected = [
      {
        projectID: 'MPProject:id1',
        manuscriptID: 'MPManuscript:id1',
      },
      {
        projectID: 'MPProject:id2',
        manuscriptID: 'MPManuscript:id1',
        projectTitle: 'Project 2',
      },
      {
        projectID: 'MPProject:id2',
        manuscriptID: 'MPManuscript:id2',
        projectTitle: 'Project 2',
      },
      {
        projectID: 'MPProject:id2',
        manuscriptID: 'MPManuscript:id3',
        projectTitle: 'Project 2',
      },
    ]

    expect(recentProjects).toEqual([
      expected[0],
      expected[3],
      expected[2],
      expected[1],
    ])
  })
})
