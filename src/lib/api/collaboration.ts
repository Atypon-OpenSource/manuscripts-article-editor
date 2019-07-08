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
  }>(`/invitation/${encodeURIComponent(projectID)}/${encodeURIComponent(role)}`)

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
  client.post(`/${encodeURIComponent(projectID)}/addUser`, {
    role,
    userId: convertUserID(userID),
  })

export const projectInvite = (
  projectID: string,
  invitedUsers: InvitedUser[],
  role: string,
  message: string = 'message'
) =>
  client.post(`/invitation/${encodeURIComponent(projectID)}/invite`, {
    invitedUsers,
    role,
    message,
  })

export const updateUserRole = (
  projectID: string,
  newRole: string | null,
  userID: string
) =>
  client.post(`/${encodeURIComponent(projectID)}/roles`, {
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
