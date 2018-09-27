import client from '../client'

interface InvitedUser {
  email: string
  name?: string
}

const convertUserID = (userID: string) => userID.replace('_', '|')

export const requestProjectInvitationToken = (
  projectID: string,
  role: string
) =>
  client.get<{
    token: string
  }>(
    `/invitation/project/${encodeURIComponent(projectID)}/${encodeURIComponent(
      role
    )}`
  )

export const acceptProjectInvitationToken = (token: string) =>
  client.post<{
    projectId: string
    message: string
  }>('/invitation/project/access', {
    token,
  })

export const addProjectUser = (
  projectID: string,
  role: string,
  userID: string
) =>
  client.post(`/project/${encodeURIComponent(projectID)}/addUser`, {
    role,
    userId: convertUserID(userID),
  })

export const projectInvite = (
  projectID: string,
  invitedUsers: InvitedUser[],
  role: string,
  message: string = 'message'
) =>
  client.post(`/invitation/project/${encodeURIComponent(projectID)}/invite`, {
    invitedUsers,
    role,
    message,
  })

export const updateUserRole = (
  projectID: string,
  newRole: string | null,
  userID: string
) =>
  client.post(`/project/${encodeURIComponent(projectID)}/roles`, {
    newRole,
    managedUserId: convertUserID(userID),
  })

export const projectUninvite = (invitationId: string) =>
  client.delete(`/invitation`, {
    data: { invitationId },
  })

export const acceptProjectInvitation = (invitationId: string) =>
  client.post('/invitation/accept', {
    invitationId,
  })

export const rejectProjectInvitation = (invitationId: string) =>
  client.post('/invitation/reject', {
    invitationId,
  })
