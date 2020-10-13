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
    containerID: string
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
  message = 'message'
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
  client.post<{
    containerID: string
    message: string
  }>('/invitation/accept', {
    invitationId,
  })

export const rejectProjectInvitation = (invitationId: string) =>
  client.post('/invitation/reject', {
    invitationId,
  })
