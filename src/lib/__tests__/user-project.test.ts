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

jest.mock('../device-id')

import { Project, UserProject } from '@manuscripts/manuscripts-json-schema'
import deviceID from '../device-id'
import { buildRecentProjects, buildUserProject } from '../user-project'

describe('user project', () => {
  test('buildUserProject', () => {
    expect(
      buildUserProject('User_id', 'MPProject:id', 'MPManuscript:id', deviceID)
        .lastOpened[deviceID].manuscriptID
    ).toBe('MPManuscript:id')
  })

  test('buildRecentProjects', () => {
    const userProjects: UserProject[] = [
      {
        _id: 'MPUserProject:id1',
        createdAt: 123123123,
        updatedAt: 123123123,
        lastOpened: {
          [deviceID]: {
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
          [deviceID]: {
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
          [deviceID]: {
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
          [deviceID]: {
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
          [deviceID]: {
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
      projects
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
