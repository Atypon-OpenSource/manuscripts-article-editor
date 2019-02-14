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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { ModalProps, withModal } from '../ModalProvider'
import TemplateSelector from '../templates/TemplateSelector'
import { InvitationData } from './ProjectsButton'
import { ProjectsDropdownList } from './ProjectsDropdownList'

interface Props {
  invitationsData: InvitationData[]
  projects: Project[]
  removeInvitationData: (id: string) => void
  handleClose?: React.MouseEventHandler<HTMLElement>
  acceptedInvitations: string[]
  rejectedInvitations: string[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
  acceptInvitation: (invitation: ProjectInvitation) => void
  confirmReject: (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ProjectInvitation
  ) => void
  user: UserProfileWithAvatar
}

class ProjectsMenu extends React.Component<Props & ModalProps> {
  public render() {
    const {
      handleClose,
      invitationsData,
      projects,
      acceptedInvitations,
      rejectedInvitations,
      acceptError,
      acceptInvitation,
      confirmReject,
    } = this.props

    const projectsIDs = projects.map(project => project._id)

    const filteredInvitationsData = invitationsData.filter(
      invitationData => projectsIDs.indexOf(invitationData.project._id) < 0
    )

    return (
      <ProjectsDropdownList
        handleClose={handleClose}
        projects={projects}
        addProject={this.openTemplateSelector}
        invitationsData={filteredInvitationsData}
        acceptedInvitations={acceptedInvitations}
        rejectedInvitations={rejectedInvitations}
        acceptInvitation={acceptInvitation}
        confirmReject={confirmReject}
        acceptError={acceptError}
      />
    )
  }

  private openTemplateSelector = () => {
    const { addModal, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector user={user} handleComplete={handleClose} />
    ))
  }
}

export default withModal<Props>(ProjectsMenu)
