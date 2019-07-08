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
  ContainerInvitation,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'

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
