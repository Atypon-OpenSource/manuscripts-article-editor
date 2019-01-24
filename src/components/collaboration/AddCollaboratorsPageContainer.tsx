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
import { Main } from '../Page'
import Panel from '../Panel'
import AddCollaboratorsSidebar from './AddCollaboratorsSidebar'
import {
  AddCollaboratorsPage,
  InviteCollaboratorsPage,
  SearchCollaboratorsPage,
} from './CollaboratorsPage'
import { InvitationValues } from './InvitationForm'
import InviteCollaboratorsSidebar from './InviteCollaboratorsSidebar'

interface State {
  people: UserProfile[] | null
  collaborators: UserProfile[]
  isInvite: boolean
  searchText: string
  addedCollaboratorsCount: number
  addedUsers: string[]
  invitationSent: boolean
}

interface Props {
  invitations: ProjectInvitation[]
  project: Project
  projects: Project[]
  user: UserProfileWithAvatar
  collaborators: Map<string, UserProfileWithAvatar>
}

type CombinedProps = Props &
  RouteComponentProps<{
    projectID: string
  }>

class CollaboratorPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    people: [],
    collaborators: [],
    isInvite: false,
    searchText: '',
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
      <>
        <Panel
          name={'collaborators-sidebar'}
          direction={'row'}
          side={'end'}
          minSize={250}
        >
          <InviteCollaboratorsSidebar
            invitationValues={invitationValues}
            handleCancel={this.handleCancel}
            handleSubmit={this.handleInvitationSubmit}
            invitationSent={invitationSent}
          />
        </Panel>
        <Main>
          <InviteCollaboratorsPage project={project} />
        </Main>
      </>
    )
  }

  private renderAddCollaboratorsPage(
    project: Project,
    people: UserProfile[],
    acceptedInvitations: ProjectInvitation[]
  ) {
    const { addedCollaboratorsCount, searchText, addedUsers } = this.state

    return (
      <>
        <Panel
          name={'add-collaborators-sidebar'}
          direction={'row'}
          side={'end'}
          minSize={250}
        >
          <AddCollaboratorsSidebar
            people={people}
            invitations={acceptedInvitations}
            numberOfAddedCollaborators={addedCollaboratorsCount}
            addedUsers={addedUsers}
            addCollaborator={this.addCollaborator}
            countAddedCollaborators={this.countAddedCollaborators}
            handleDoneCancel={this.handleDoneCancel}
            handleInvite={this.handleInvite}
            setSearchText={this.setSearchText}
          />
        </Panel>
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
      </>
    )
  }

  private buildPeople = () => {
    const { projectID } = this.props.match.params

    const { project, projects, collaborators } = this.props

    const otherProjects = projects.filter(project => project._id !== projectID)

    const projectCollaborators = buildCollaborators(project, collaborators)

    const otherProjectCollaborators: UserProfile[] = []

    for (const otherProject of otherProjects) {
      const otherCollaborators = buildCollaborators(otherProject, collaborators)

      otherProjectCollaborators.push(...otherCollaborators)
    }

    return difference(otherProjectCollaborators, projectCollaborators)
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

  private setSearchText = (searchText: string) => this.setState({ searchText })

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

export default CollaboratorPageContainer
