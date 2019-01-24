import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor/dist/types'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import UserData from '../../data/UserData'
import { getCurrentUserId } from '../../lib/user'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { ModalProps, withModal } from '../ModalProvider'
import { TemplateSelector } from '../templates/TemplateSelector'
import { InvitationData } from './ProjectsDropdownButton'
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
}

class ProjectsMenu extends React.Component<
  Props & ModelsProps & RouteComponentProps & ModalProps
> {
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
      <UserData userID={getCurrentUserId()!}>
        {user => (
          <ProjectsDropdownList
            handleClose={handleClose}
            projects={projects}
            addProject={this.openTemplateSelector(user)}
            invitationsData={filteredInvitationsData}
            acceptedInvitations={acceptedInvitations}
            rejectedInvitations={rejectedInvitations}
            acceptInvitation={acceptInvitation}
            confirmReject={confirmReject}
            acceptError={acceptError}
          />
        )}
      </UserData>
    )
  }

  private openTemplateSelector = (user: UserProfile) => () => {
    const { addModal, history, models } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        history={history}
        saveModel={models.saveModel}
        user={user}
        handleComplete={handleClose}
      />
    ))
  }
}

export default withRouter<Props & RouteComponentProps>(
  withModal(withModels(ProjectsMenu))
)
