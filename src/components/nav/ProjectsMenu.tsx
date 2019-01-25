import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
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
