import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import { CollaboratorDetailsPage } from '../components/CollaboratorsPage'
import CollaboratorsSidebar from '../components/CollaboratorsSidebar'
import { Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { getComponentFromDoc } from '../transformer/decode'
import { PROJECT_INVITATION, USER_PROFILE } from '../transformer/object-types'
import {
  Attachments,
  Project,
  ProjectInvitation,
  UserProfile,
} from '../types/components'

interface State {
  project: Project | null
  collaborators: UserProfile[] | null
  invitations: ProjectInvitation[] | null
  isSettingsOpen: boolean
  error: string | null
  userMap: Map<string, UserProfile>
  hoveredID: string
}

interface Props {
  id: string
}

interface RouteParams {
  projectID: string
}

type CombinedProps = Props &
  ComponentsProps &
  RouteComponentProps<RouteParams> &
  UserProps

class CollaboratorPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    project: null,
    collaborators: null,
    isSettingsOpen: false,
    invitations: null,
    error: null,
    userMap: new Map(),
    hoveredID: '',
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    this.subs.push(this.loadUserMap())
    this.subs.push(this.loadProject())
    this.subs.push(this.loadInvitations())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const {
      collaborators,
      project,
      invitations,
      isSettingsOpen,
      hoveredID,
    } = this.state
    const { user } = this.props

    if (!collaborators || !project || !invitations) {
      return <Spinner />
    }

    if (!user.loaded) {
      return <Spinner />
    }

    if (!user.data) {
      if (user.error) {
        return <Spinner color={'red'} />
      }

      return <Redirect to={'/login'} />
    }

    return (
      <Page projectID={project.id}>
        <CollaboratorsSidebar
          collaborators={collaborators}
          invitations={invitations}
          project={project}
          user={user.data}
          isSettingsOpen={isSettingsOpen}
          openPopper={this.openPopper}
          handleAddCollaborator={this.handleAddCollaborator}
          handleHover={this.handleHover}
          hoveredID={hoveredID}
        />
        <Main>
          <CollaboratorDetailsPage
            project={project}
            user={user.data}
            collaboratorsCount={collaborators.length + invitations.length}
            handleAddCollaborator={this.handleAddCollaborator}
          />
        </Main>
      </Page>
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<{}>
  }

  private getProjectID = () => this.props.match.params.projectID

  private loadProject = () =>
    this.getCollection()
      .findOne(this.getProjectID())
      .$.subscribe(async (doc: RxDocument<Project>) => {
        const project = doc.toJSON() as Project
        const getCollaborator = (id: string) =>
          this.state.userMap.get(id) as UserProfile

        const collaborators = [
          ...project.owners.map(getCollaborator),
          ...project.writers.map(getCollaborator),
          ...project.viewers.map(getCollaborator),
        ].filter(collaborator => collaborator)

        this.setState({
          project,
          collaborators,
        })
      })

  private loadInvitations = () =>
    this.getCollection()
      .find({
        objectType: PROJECT_INVITATION,
        projectID: this.getProjectID(),
      })
      .$.subscribe((invitationsDocs: Array<RxDocument<ProjectInvitation>>) => {
        const invitations = invitationsDocs.map(
          invitation => invitation.toJSON() as ProjectInvitation
        )

        this.setState({ invitations })
      })

  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: USER_PROFILE })
      .$.subscribe(
        async (docs: Array<RxDocument<UserProfile & Attachments>>) => {
          const users = await Promise.all(
            docs.map(doc => getComponentFromDoc<UserProfile>(doc))
          )

          const userMap = users.reduce((output, user) => {
            output.set(user.userID, user)
            return output
          }, new Map())

          this.setState({ userMap })
        }
      )

  private handleAddCollaborator = () => {
    const { projectID } = this.props.match.params

    this.props.history.push(`/projects/${projectID}/collaborators/add`)
  }

  private handleHover = (hoveredID: string = '') => {
    if (!this.state.isSettingsOpen) {
      this.setState({ hoveredID })
    }
  }

  private openPopper = (isOpen: boolean) => {
    this.setState({
      isSettingsOpen: isOpen,
    })
  }
}

export default withComponents(withUser(CollaboratorPageContainer))
