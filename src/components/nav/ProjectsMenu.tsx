import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { acceptProjectInvitation, rejectProjectInvitation } from '../../lib/api'
import {
  buildContributor,
  buildManuscript,
  buildProject,
} from '../../lib/commands'
import { ContributorRole } from '../../lib/roles'
import sessionID from '../../lib/sessionID'
import timestamp from '../../lib/timestamp'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { PROJECT } from '../../transformer/object-types'
import { Project, ProjectInvitation, UserProfile } from '../../types/models'
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
  Props & ModelsProps & UserProps & RouteComponentProps,
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
        addProject={this.addProject}
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
      .find({ objectType: PROJECT })
      .$.subscribe((docs: Array<RxDocument<Project>>) => {
        this.setState({
          projects: docs.map(doc => doc.toJSON()),
        })
      })

  private addProject = async () => {
    // TODO: open up the template modal

    const user = this.props.user.data as UserProfile

    const owner = user.userID

    const collection = this.getCollection()

    const project = buildProject(owner) as Project

    const now = timestamp()
    project.createdAt = now
    project.updatedAt = now
    project.sessionID = sessionID

    const projectID = project._id

    await collection.insert(project)

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.models.saveModel(contributor, {
      manuscriptID,
      projectID,
    })

    await this.props.models.saveModel(manuscript, {
      manuscriptID,
      projectID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
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
  withModels<Props & RouteComponentProps>(withUser(ProjectsMenu))
)
