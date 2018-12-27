import {
  ObjectTypes,
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import Spinner from '../../icons/spinner'
import { addProjectUser, projectInvite } from '../../lib/api'
import { buildUserMap } from '../../lib/data'
import { isOwner } from '../../lib/roles'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { Main, Page } from '../Page'
import AddCollaboratorsSidebar from './AddCollaboratorsSidebar'
import {
  AddCollaboratorsPage,
  InviteCollaboratorsPage,
  SearchCollaboratorsPage,
} from './CollaboratorsPage'
import { InvitationValues } from './InvitationForm'
import InviteCollaboratorsSidebar from './InviteCollaboratorsSidebar'

interface State {
  project: Project | null
  people: UserProfile[] | null
  collaborators: UserProfile[]
  invitations: ProjectInvitation[]
  isInvite: boolean
  searchText: string
  userMap: Map<string, UserProfile>
  addedCollaboratorsCount: number
  addedUsers: string[]
}

interface RouteParams {
  projectID: string
}

type CombinedProps = ModelsProps & RouteComponentProps<RouteParams> & UserProps

class CollaboratorPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    project: null,
    people: [],
    collaborators: [],
    invitations: [],
    isInvite: false,
    searchText: '',
    userMap: new Map(),
    addedCollaboratorsCount: 0,
    addedUsers: [],
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    // TODO: need to load these sequentially
    this.subs.push(this.loadUserMap())
    this.subs.push(this.loadInvitations())
    this.subs.push(this.loadProject())
    this.subs.push(this.loadCollaborators())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { project, people, invitations, isInvite } = this.state

    const { user } = this.props

    if (!people || !project) {
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

    if (!isOwner(project, user.data.userID)) {
      return <Redirect to={`/projects/${project._id}/collaborators`} />
    }

    if (isInvite) {
      return this.renderInviteCollaboratorPage(project)
    }

    return this.renderAddCollaboratorsPage(project, people, invitations)
  }

  private renderInviteCollaboratorPage(project: Project) {
    const { searchText } = this.state

    const invitationValues = {
      name: '',
      email: '',
      role: 'Writer',
    }

    if (searchText.includes('@')) {
      invitationValues.email = searchText
    } else {
      invitationValues.name = searchText
    }

    return (
      <Page project={project}>
        <InviteCollaboratorsSidebar
          invitationValues={invitationValues}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleInvitationSubmit}
        />
        <Main>
          <InviteCollaboratorsPage project={project} />
        </Main>
      </Page>
    )
  }

  private renderAddCollaboratorsPage(
    project: Project,
    people: UserProfile[],
    invitations: ProjectInvitation[]
  ) {
    const { addedCollaboratorsCount, searchText, addedUsers } = this.state

    return (
      <Page project={project}>
        <AddCollaboratorsSidebar
          people={people}
          invitations={invitations}
          numberOfAddedCollaborators={addedCollaboratorsCount}
          addedUsers={addedUsers}
          addCollaborator={this.addCollaborator}
          countAddedCollaborators={this.countAddedCollaborators}
          handleDoneCancel={this.handleDoneCancel}
          handleInvite={this.handleInvite}
          setSearchText={this.setSearchText}
        />
        <Main>
          {!searchText.length ? (
            <AddCollaboratorsPage
              project={project}
              addedCollaboratorsCount={addedCollaboratorsCount}
            />
          ) : (
            <SearchCollaboratorsPage
              project={project}
              searchText={searchText}
            />
          )}
        </Main>
      </Page>
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private getProjectID = () => this.props.match.params.projectID

  private loadProject = () =>
    this.getCollection()
      .findOne(this.getProjectID())
      .$.subscribe(async (doc: RxDocument<Project>) => {
        if (!doc) return

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

  private loadCollaborators = () =>
    this.getCollection()
      .find({ objectType: ObjectTypes.Project })
      .$.subscribe(async (docs: Array<RxDocument<Project>>) => {
        if (this.state.people && !this.state.people.length) {
          const getCollaborator = (id: string) =>
            this.state.userMap.get(id) as UserProfile

          const people: UserProfile[] = []

          for (const doc of docs) {
            const project = doc.toJSON() as Project

            const collaborators: UserProfile[] = [
              ...project.owners.map(getCollaborator),
              ...project.writers.map(getCollaborator),
              ...project.viewers.map(getCollaborator),
            ].filter(collaborator => collaborator)

            for (const person of collaborators) {
              people.push(person)
            }
          }

          const { collaborators } = this.state

          const nonCollaborators = people.filter(
            collaborator => !collaborators.includes(collaborator)
          )

          this.setState({
            people: [...new Set(nonCollaborators)],
          })
        }
      })

  private loadInvitations = () =>
    this.getCollection()
      .find({
        objectType: ObjectTypes.ProjectInvitation,
        projectID: this.getProjectID(),
      })
      .$.subscribe((docs: Array<RxDocument<ProjectInvitation>>) => {
        const invitations = docs
          .map(invitation => invitation.toJSON() as ProjectInvitation)
          .filter(invitation => !invitation.acceptedAt)

        this.setState({
          invitations,
          addedCollaboratorsCount: invitations.length,
        })
      })

  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: ObjectTypes.UserProfile })
      .$.subscribe(async (docs: Array<RxDocument<UserProfile>>) => {
        this.setState({
          userMap: await buildUserMap(docs),
        })
      })

  private addCollaborator = async (
    userID: string,
    role: string
  ): Promise<void> => {
    await addProjectUser(this.getProjectID(), role, userID)

    this.setState({
      addedUsers: this.state.addedUsers.concat(userID),
    })
  }

  private countAddedCollaborators = () => {
    this.setState({
      addedCollaboratorsCount: this.state.addedCollaboratorsCount + 1,
    })
  }

  private handleDoneCancel = () => {
    const projectID = this.getProjectID()

    this.props.history.push(`/projects/${projectID}/collaborators`)
  }

  private handleInvite = () => {
    this.setState({
      isInvite: true,
    })
  }

  private setSearchText = (searchText: string) => this.setState({ searchText }) // FIXME: Don't use get

  private handleCancel = () => {
    this.setState({
      searchText: '',
      isInvite: false,
    })
  }

  private handleInvitationSubmit = async (values: InvitationValues) => {
    const { email, name, role } = values

    await projectInvite(this.getProjectID(), [{ email, name }], role)
  }
}

export default withModels(withUser(CollaboratorPageContainer))
