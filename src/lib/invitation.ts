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

import {
  ContainerInvitation,
  ProjectInvitation,
} from '@manuscripts/json-schema'

interface GroupedInvitations {
  [key: string]: ContainerInvitation[]
}
export const buildContainerInvitations = (invitations: ProjectInvitation[]) => {
  const containerInvitations: ContainerInvitation[] = []

  for (const invitation of invitations) {
    const { projectID, objectType, projectTitle, ...data } = invitation
    containerInvitations.push({
      containerID: projectID,
      containerTitle: projectTitle,
      objectType: 'MPContainerInvitation',
      ...data,
    })
  }
  return containerInvitations
}

export const groupInvitations = (
  invitations: ContainerInvitation[],
  groupBy: string
) => {
  const groupedInvitations: GroupedInvitations = {}
  invitations.forEach((invitation) => {
    const key =
      groupBy === 'Container'
        ? invitation.containerID
        : invitation.invitedUserEmail

    if (!groupedInvitations[key]) {
      groupedInvitations[key] = []
    }
    groupedInvitations[key].push(invitation)
  })
  return groupedInvitations
}

export const findLeastLimitingInvitation = (
  invitations: ContainerInvitation[]
) => {
  invitations.sort(compareInvitationsRoles)
  return invitations[invitations.length - 1]
}

export const buildInvitations = (
  invitations: ProjectInvitation[],
  containerInvitations: ContainerInvitation[]
) => {
  const allInvitations = [
    ...buildContainerInvitations(invitations),
    ...containerInvitations,
  ].filter((invitation) => invitation.containerID.startsWith('MPProject'))

  const invitationsByInvitedUser = groupInvitations(allInvitations, 'User')

  const leastLimitingInvitations: ContainerInvitation[] = []

  for (const invitations of Object.values(invitationsByInvitedUser)) {
    leastLimitingInvitations.push(findLeastLimitingInvitation(invitations))
  }

  return leastLimitingInvitations
}

export const compareInvitationsRoles = (
  a: ContainerInvitation,
  b: ContainerInvitation
) => rolePriority[a.role] - rolePriority[b.role]

const rolePriority: { [key: string]: number } = {
  Owner: 2,
  Writer: 1,
  Viewer: 0,
}
