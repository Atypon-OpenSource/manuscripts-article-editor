import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import UserData from '../../data/UserData'
import { acceptProjectInvitation, rejectProjectInvitation } from '../../lib/api'
import { getCurrentUserId } from '../../lib/user'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { ModalProps, withModal } from '../ModalProvider'
import { InvitationsList } from '../projects/InvitationsList'
import { TemplateSelector } from '../templates/TemplateSelector'
import { InvitationData } from './ProjectsDropdownButton'
import { ProjectsDropdownList } from './ProjectsDropdownList'

interface State {
  acceptedInvitations: string[]
  rejectedInvitations: string[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
}

interface Props {
  invitationsData: InvitationData[]
  projects: Project[]
  removeInvitationData: (id: string) => void
  handleClose?: React.MouseEventHandler<HTMLElement>
  renderInvitations?: boolean
}

class ProjectsMenu extends React.Component<
  Props & ModelsProps & RouteComponentProps & ModalProps,
  State
> {
  public state: Readonly<State> = {
    acceptedInvitations: [],
    rejectedInvitations: [],
    acceptError: null,
  }

  public render() {
    const {
      handleClose,
      invitationsData,
      projects,
      renderInvitations,
    } = this.props
    const { acceptedInvitations, rejectedInvitations, acceptError } = this.state

    const projectsIDs = projects.map(project => project._id)

    const filteredInvitationsData = invitationsData.filter(
      invitationData => projectsIDs.indexOf(invitationData.project._id) < 0
    )

    return (
      <UserData userID={getCurrentUserId()!}>
        {user =>
          renderInvitations ? (
            <InvitationsList
              invitationsData={filteredInvitationsData}
              acceptInvitation={this.acceptInvitation}
              rejectInvitation={this.rejectInvitation}
              acceptError={acceptError}
            />
          ) : (
            <ProjectsDropdownList
              handleClose={handleClose}
              projects={projects}
              addProject={this.openTemplateSelector(user)}
              invitationsData={filteredInvitationsData}
              acceptedInvitations={acceptedInvitations}
              rejectedInvitations={rejectedInvitations}
              acceptInvitation={this.acceptInvitation}
              rejectInvitation={this.rejectInvitation}
              acceptError={acceptError}
            />
          )
        }
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

  private acceptInvitation = async (invitation: ProjectInvitation) => {
    try {
      await acceptProjectInvitation(invitation._id)

      const acceptedInvitations = this.state.acceptedInvitations.concat(
        invitation.projectID
      )

      this.setState({ acceptedInvitations })

      this.props.removeInvitationData(invitation._id)
    } catch (error) {
      const errorMessage =
        error && error.response && error.response.status === 400
          ? 'The invitation does not exist, either because it has expired or the project owner uninvited you.'
          : `Service unreachable, please try again later.`

      this.setState({
        acceptError: { invitationId: invitation._id, errorMessage },
      })
    }
  }

  private rejectInvitation = async (invitation: ProjectInvitation) => {
    await rejectProjectInvitation(invitation._id)

    const rejectedInvitations = this.state.rejectedInvitations.concat(
      invitation.projectID
    )

    this.setState({ rejectedInvitations })

    this.props.removeInvitationData(invitation._id)
  }
}

export default withRouter<Props & RouteComponentProps>(
  withModal(withModels(ProjectsMenu))
)
