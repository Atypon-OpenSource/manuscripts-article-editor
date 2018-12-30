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
      `/invitation/project/${encodeURIComponent(projectID)}/invite`,
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
      `/project/${encodeURIComponent(projectID)}/addUser`,
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
      `/project/${encodeURIComponent(projectID)}/roles`,
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
      `/invitation/project/${encodeURIComponent(
        projectID
      )}/${encodeURIComponent(role)}`
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
