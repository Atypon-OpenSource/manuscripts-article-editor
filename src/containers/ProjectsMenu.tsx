import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { ProjectsDropdownList } from '../components/ProjectsDropdownList'
import { acceptProjectInvitation, rejectProjectInvitation } from '../lib/api'
import {
  buildContributor,
  buildManuscript,
  buildProject,
} from '../lib/commands'
import sessionID from '../lib/sessionID'
import timestamp from '../lib/timestamp'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { PROJECT } from '../transformer/object-types'
import { Project, ProjectInvitation, UserProfile } from '../types/components'
import { AddProject, ProjectDocument } from '../types/project'
import { InvitationData } from './ProjectsDropdownButton'

interface State {
  projects: Project[] | null
  acceptedInvitations: string[]
  rejectedInvitations: string[]
}

interface Props {
  invitationsData: InvitationData[]
  removeInvitationData: (id: string) => void
  handleClose?: React.MouseEventHandler<HTMLElement>
}

class ProjectsMenu extends React.Component<
  Props & ComponentsProps & UserProps,
  State
> {
  public state: Readonly<State> = {
    projects: null,
    acceptedInvitations: [],
    rejectedInvitations: [],
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
    const { projects, acceptedInvitations, rejectedInvitations } = this.state

    if (projects === null) {
      return null
    }

    return (
      <ProjectsDropdownList
        handleClose={handleClose}
        projects={projects}
        addProject={this.addProject}
        invitationsData={invitationsData}
        acceptedInvitations={acceptedInvitations}
        rejectedInvitations={rejectedInvitations}
        acceptInvitation={this.acceptInvitation}
        rejectInvitation={this.rejectInvitation}
      />
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<{}>
  }

  private loadProjects = () =>
    this.getCollection()
      .find({ objectType: PROJECT })
      .$.subscribe((docs: ProjectDocument[]) => {
        this.setState({
          projects: docs.map(doc => doc.toJSON()),
        })
      })

  private addProject: AddProject = async () => {
    // TODO: open up the template modal

    const user = this.props.user.data as UserProfile

    const owner = user.userID

    const collection = this.getCollection()

    const project = buildProject(owner) as Project

    const now = timestamp()
    project.createdAt = now
    project.updatedAt = now
    project.sessionID = sessionID

    const projectID = project.id

    await collection.insert(project)

    const manuscript = buildManuscript()
    const manuscriptID = manuscript.id

    const contributor = buildContributor(user.bibliographicName)

    await this.props.components.saveComponent(contributor, {
      manuscriptID,
      projectID,
    })

    await this.props.components.saveComponent(manuscript, {
      manuscriptID,
      projectID,
    })

    window.location.href = `/projects/${projectID}/manuscripts/${manuscriptID}`
  }

  private acceptInvitation = async (invitation: ProjectInvitation) => {
    await acceptProjectInvitation(invitation.id)

    const acceptedInvitations = this.state.acceptedInvitations.concat(
      invitation.projectID
    )

    this.setState({ acceptedInvitations })

    this.props.removeInvitationData(invitation.id)
  }

  private rejectInvitation = async (invitation: ProjectInvitation) => {
    await rejectProjectInvitation(invitation.id)

    const rejectedInvitations = this.state.rejectedInvitations.concat(
      invitation.projectID
    )

    this.setState({ rejectedInvitations })

    this.props.removeInvitationData(invitation.id)
  }
}

export default withComponents<Props>(withUser(ProjectsMenu))
