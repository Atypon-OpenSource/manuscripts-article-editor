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

import client from '../../client'
import {
  acceptProjectInvitation,
  acceptProjectInvitationToken,
  addProjectUser,
  projectInvite,
  projectUninvite,
  rejectProjectInvitation,
  requestProjectInvitationToken,
  updateUserRole,
} from '../collaboration'

jest.mock('../../client', () => ({
  post: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
}))

describe('collaboration', () => {
  test('project invite', async () => {
    const projectID = ' project id'
    const invitedUsers = [{ email: 'email' }]
    const role = 'role'

    await projectInvite(projectID, invitedUsers, role)

    expect(client.post).toBeCalledWith(
      `/invitation/${encodeURIComponent(projectID)}/invite`,
      {
        invitedUsers,
        role,
        message: 'message',
      }
    )
  })

  test('add project user', async () => {
    const projectID = ' project id'
    const role = 'role'
    const userId = 'user id'
    await addProjectUser(projectID, role, userId)

    expect(client.post).toBeCalledWith(
      `/${encodeURIComponent(projectID)}/addUser`,
      {
        role,
        userId,
      }
    )
  })

  test('update user role', async () => {
    const projectID = 'project id'
    const newRole = 'role'
    const userId = 'user id'
    await updateUserRole(projectID, newRole, userId)

    expect(client.post).toBeCalledWith(
      `/${encodeURIComponent(projectID)}/roles`,
      {
        newRole,
        managedUserId: userId,
      }
    )
  })

  test('accept project invitation', async () => {
    const invitationId = 'invitation id'
    await acceptProjectInvitation(invitationId)

    expect(client.post).toBeCalledWith(`/invitation/accept`, {
      invitationId,
    })
  })

  test('reject project invitation', async () => {
    const invitationId = 'invitation id'
    await rejectProjectInvitation(invitationId)

    expect(client.post).toBeCalledWith(`/invitation/reject`, {
      invitationId,
    })
  })

  test('uninvite user', async () => {
    const invitationId = 'invitation id'
    await projectUninvite(invitationId)

    expect(client.delete).toBeCalledWith(`/invitation`, {
      data: { invitationId },
    })
  })

  test('request project invitation token', async () => {
    const projectID = 'project id'
    const role = 'role'

    await requestProjectInvitationToken(projectID, role)

    expect(client.get).toBeCalledWith(
      `/invitation/${encodeURIComponent(projectID)}/${encodeURIComponent(role)}`
    )
  })

  test('accept project invitation token', async () => {
    const token = 'token'

    await acceptProjectInvitationToken(token)

    expect(client.post).toBeCalledWith('/invitation/project/access', {
      token,
    })
  })
})
