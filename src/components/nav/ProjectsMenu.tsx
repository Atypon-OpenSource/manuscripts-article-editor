import {
  ObjectTypes,
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { acceptProjectInvitation, rejectProjectInvitation } from '../../lib/api'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { ModalProps, withModal } from '../ModalProvider'
import { TemplateSelector } from '../templates/TemplateSelector'
import { InvitationData } from './ProjectsDropdownButton'
import { ProjectsDropdownList } from './ProjectsDropdownList'

interface State {
  projects: Project[] | null
  acceptedInvitations: string[]
  rejectedInvitations: string[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
}

interface Props {
  invitationsData: InvitationData[]
  removeInvitationData: (id: string) => void
  handleClose?: React.MouseEventHandler<HTMLElement>
}

class ProjectsMenu extends React.Component<
  Props & ModelsProps & UserProps & RouteComponentProps & ModalProps,
  State
> {
  public state: Readonly<State> = {
    projects: null,
    acceptedInvitations: [],
    rejectedInvitations: [],
    acceptError: null,
  }

  private subs: Subscription[] = []

  public async componentDidMount() {
    this.subs.push(this.loadProjects())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { handleClose, invitationsData } = this.props
    const {
      projects,
      acceptedInvitations,
      rejectedInvitations,
      acceptError,
    } = this.state

    if (projects === null) {
      return null
    }

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
        acceptInvitation={this.acceptInvitation}
        rejectInvitation={this.rejectInvitation}
        acceptError={acceptError}
      />
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private loadProjects = () =>
    this.getCollection()
      .find({ objectType: ObjectTypes.Project })
      .$.subscribe((docs: Array<RxDocument<Project>>) => {
        this.setState({
          projects: docs.map(doc => doc.toJSON()),
        })
      })

  private openTemplateSelector = () => {
    const { addModal, history, models, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        history={history}
        saveModel={models.saveModel}
        user={user.data!}
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
  withModal(withModels(withUser(ProjectsMenu)))
)
