import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { difference } from 'lodash-es'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { addProjectUser, projectInvite } from '../../lib/api'
import { buildCollaborators } from '../../lib/collaborators'
import { isOwner } from '../../lib/roles'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
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
  isSearching: boolean
  isInvite: boolean
  searchText: string
  searchResults: UserProfile[]
  addedCollaboratorsCount: number
  addedUsers: string[]
  invitationSent: boolean
}

interface Props {
  invitations: ProjectInvitation[]
  project: Project
  projects: Project[]
  user: UserProfileWithAvatar
  users: Map<string, UserProfileWithAvatar>
}

type CombinedProps = Props &
  ModelsProps &
  RouteComponentProps<{
    projectID: string
  }>

class CollaboratorPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    isSearching: false,
    isInvite: false,
    searchText: '',
    searchResults: [],
    addedCollaboratorsCount: 0,
    addedUsers: [],
    invitationSent: false,
  }

  public render() {
    const { isInvite } = this.state
    const { invitations, project, user } = this.props

    if (!isOwner(project, user.userID)) {
      return <Redirect to={`/projects/${project._id}/collaborators`} />
    }

    if (isInvite) {
      return this.renderInviteCollaboratorPage(project)
    }

    const acceptedInvitations = invitations.filter(
      invitation => !invitation.acceptedAt
    )

    const people = this.buildPeople()

    return this.renderAddCollaboratorsPage(project, people, acceptedInvitations)
  }

  private renderInviteCollaboratorPage(project: Project) {
    const { searchText, invitationSent } = this.state

    const isEmail = searchText.includes('@')

    const invitationValues = {
      name: isEmail ? '' : searchText,
      email: isEmail ? searchText : '',
      role: 'Writer',
    }

    return (
      <Page project={project}>
        <InviteCollaboratorsSidebar
          invitationValues={invitationValues}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleInvitationSubmit}
          invitationSent={invitationSent}
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
    acceptedInvitations: ProjectInvitation[]
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
          invitations={acceptedInvitations}
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

  private buildPeople = () => {
    const { projectID } = this.props.match.params

    const { project, projects, users } = this.props

    const otherProjects = projects.filter(project => project._id !== projectID)

    const projectCollaborators = buildCollaborators(project, users)

    const collaborators: UserProfile[] = []

    for (const otherProject of otherProjects) {
      const otherCollaborators = buildCollaborators(otherProject, users)

      collaborators.push(...otherCollaborators)
    }

    return difference(collaborators, projectCollaborators)
  }

  private addCollaborator = async (
    userID: string,
    role: string
  ): Promise<void> => {
    const { projectID } = this.props.match.params

    await addProjectUser(projectID, role, userID)

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
    const { projectID } = this.props.match.params

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
    const { addedUsers } = this.state

    if (!searchText) {
      return this.setState({
        searchResults: [],
      })
    }

    searchText = searchText.toLowerCase()

    const people = this.buildPeople()

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
    this.setState({ invitationSent: false })
  }

  private handleInvitationSubmit = async (values: InvitationValues) => {
    const { projectID } = this.props.match.params

    const { email, name, role } = values

    await projectInvite(projectID, [{ email, name }], role)
    this.setState({ invitationSent: true })
  }
}

export default withModels<Props>(CollaboratorPageContainer)
