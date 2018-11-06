import {
  PROJECT,
  PROJECT_INVITATION,
  USER_PROFILE,
} from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { FormikActions, FormikErrors } from 'formik'
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
import { InvitationErrors, InvitationValues } from './InvitationForm'
import InviteCollaboratorsSidebar from './InviteCollaboratorsSidebar'

interface State {
  project: Project | null
  people: UserProfile[] | null
  collaborators: UserProfile[]
  invitations: ProjectInvitation[]
  isSearching: boolean
  isInvite: boolean
  searchText: string
  searchResults: UserProfile[]
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
    isSearching: false,
    isInvite: false,
    searchText: '',
    searchResults: [],
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

    const initialValues = {
      name: '',
      email: '',
      role: '',
    }

    if (searchText.includes('@')) {
      initialValues.email = searchText
    } else {
      initialValues.name = searchText
    }

    return (
      <Page project={project}>
        <InviteCollaboratorsSidebar
          initialValues={initialValues}
          handleCancel={this.handleCancel}
          onSubmit={this.handleInvitationSubmit}
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
    const {
      addedCollaboratorsCount,
      isSearching,
      searchText,
      searchResults,
      addedUsers,
    } = this.state

    return (
      <Page project={project}>
        <AddCollaboratorsSidebar
          people={people}
          invitations={invitations}
          numberOfAddedCollaborators={addedCollaboratorsCount}
          isSearching={isSearching}
          searchText={searchText}
          searchResults={searchResults}
          addedUsers={addedUsers}
          addCollaborator={this.addCollaborator}
          countAddedCollaborators={this.countAddedCollaborators}
          handleDoneCancel={this.handleDoneCancel}
          handleInvite={this.handleInvite}
          handleSearchChange={this.handleSearchChange}
          handleSearchFocus={this.handleSearchFocus}
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
      .find({ objectType: PROJECT })
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
        objectType: PROJECT_INVITATION,
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
      .find({ objectType: USER_PROFILE })
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

  private handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      searchText: event.currentTarget.value,
    })
    this.search(event.currentTarget.value)
  }

  private handleSearchFocus = () => {
    this.setState({
      isSearching: !this.state.isSearching,
    })
  }

  private search = (searchText: string) => {
    const { people, addedUsers } = this.state

    if (!people || !searchText) {
      return this.setState({
        searchResults: [],
      })
    }

    searchText = searchText.toLowerCase()

    const searchResults: UserProfile[] = people.filter(person => {
      if (addedUsers.includes(person.userID)) return false

      if (searchText.includes('@')) {
        return person.email && person.email.toLowerCase().includes(searchText)
      }

      const personName = [
        person.bibliographicName.given,
        person.bibliographicName.family,
      ]
        .filter(part => part)
        .join(' ')
        .toLowerCase()

      return personName && personName.includes(searchText)
    })

    this.setState({
      searchResults,
    })
  }

  private handleCancel = () => {
    this.setState({
      searchText: '',
      isInvite: false,
    })
  }

  private handleInvitationSubmit = async (
    values: InvitationValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<InvitationValues | InvitationErrors>
  ) => {
    const { email, name, role } = values

    try {
      await projectInvite(this.getProjectID(), [{ email, name }], role)

      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<InvitationErrors> = {}

      if (error.response) {
        errors.submit = error.response
      }

      setErrors(errors)
    }
  }
}

export default withModels(withUser(CollaboratorPageContainer))
