import client from '../../client'
import { addProjectUser, projectInvite, updateUserRole } from '../collaboration'

jest.mock('../../client', () => ({
  post: jest.fn(),
}))

describe('collaboration', () => {
  test('project invite', async () => {
    const projectID = ' project id'
    const invitedUsers = [{ email: 'email' }]
    const role = 'role'
    const message = 'message'
    await projectInvite(projectID, invitedUsers, role, message)

    expect(client.post).toBeCalledWith(
      `/invitation/project/${encodeURIComponent(projectID)}/invite`,
      {
        invitedUsers,
        role,
        message,
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
    const projectID = ' project id'
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
})
