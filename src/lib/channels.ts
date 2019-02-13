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

import {
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'

// NOTE: need to wait for projects to sync before we can start syncing collaborators
export const buildCollaboratorChannels = (
  userID: string,
  projects: Project[],
  invitations: ProjectInvitation[]
) => {
  const userIDs: Set<string> = new Set([userID])

  projects.forEach(project => {
    const collaborators = [
      ...project.owners,
      ...project.writers,
      ...project.viewers,
    ]

    collaborators.forEach(userID => {
      userIDs.add(userID)
    })
  })

  invitations.forEach(invitation => {
    userIDs.add(invitation.invitingUserID)
  })

  return [...userIDs].map(userID => `${userID}-read`)
}
