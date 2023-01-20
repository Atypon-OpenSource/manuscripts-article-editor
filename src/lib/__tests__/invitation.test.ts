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

import { ContainerInvitation } from '@manuscripts/json-schema'

import {
  compareInvitationsRoles,
  findLeastLimitingInvitation,
  groupInvitations,
} from '../invitation'

describe('invitation', () => {
  const invitations: ContainerInvitation[] = [
    {
      containerID: 'MPProject:1',
      _id: 'invitation-1a',
      invitedUserEmail: 'valid-user@atypon.com',
      role: 'Writer',
    } as any,
    {
      containerID: 'MPProject:1',
      _id: 'invitation-1b',
      invitedUserEmail: 'valid-user@atypon.com',
      role: 'Owner',
    },
    {
      containerID: 'MPProject:1',
      _id: 'invitation-1c',
      invitedUserEmail: 'valid-user@atypon.com',
      role: 'Viewer',
    },
    {
      containerID: 'MPProject:2',
      _id: 'invitation-2a',
      invitedUserEmail: 'valid-user@atypon.com',
      role: 'Viewer',
    },
    {
      containerID: 'MPProject:2',
      _id: 'invitation-2b',
      invitedUserEmail: 'valid-user@atypon.com',
      role: 'Writer',
    },
    {
      containerID: 'MPProject:3',
      _id: 'invitation-3',
      invitedUserEmail: 'valid-user@atypon.com',
      role: 'Writer',
    },
  ]
  it('groupInvitations', () => {
    const expected = {
      'MPProject:1': [invitations[0], invitations[1], invitations[2]],
      'MPProject:2': [invitations[3], invitations[4]],
      'MPProject:3': [invitations[5]],
    }
    expect(groupInvitations(invitations, 'Container')).toEqual(expected)
  })

  it('findLeastLimitingInvitation', () => {
    expect(
      findLeastLimitingInvitation([
        invitations[0],
        invitations[1],
        invitations[2],
      ])
    ).toEqual(invitations[1])
  })

  it('compareInvitationsRoles', () => {
    expect(compareInvitationsRoles(invitations[3], invitations[4])).toEqual(-1)
  })
})
