/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  ContainerInvitation,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { difference } from 'lodash-es'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { TokenActions } from '../../data/TokenData'
import { addProjectUser, projectInvite } from '../../lib/api'
import { buildCollaborators } from '../../lib/collaborators'
import { isOwner } from '../../lib/roles'
import { trackEvent } from '../../lib/tracking'
import { Main } from '../Page'
import Panel from '../Panel'
import { ResizingOutlinerButton } from '../ResizerButtons'
import AddCollaboratorsSidebar from './AddCollaboratorsSidebar'
import {
  AddCollaboratorsPage,
  InviteCollaboratorsPage,
  SearchCollaboratorsPage,
} from './CollaboratorsPage'
import { InvitationValues } from './InvitationForm'
import InviteCollaboratorsSidebar from './InviteCollaboratorsSidebar'

interface State {
  people: UserProfile[]
  collaborators: UserProfile[]
  isInvite: boolean
  searchText: string
  addedCollaboratorsCount: number
  addedUsers: string[]
  invitationSent: boolean
}

interface Props {
  invitations: ContainerInvitation[]
  project: Project
  projects: Project[]
  user: UserProfileWithAvatar
  collaborators: Map<string, UserProfileWithAvatar>
  tokenActions: TokenActions
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

  public componentDidMount() {
    const people = this.buildPeople()
    this.setState({ people })
  }

  public render() {
    const { isInvite } = this.state
    const { invitations, project, user, collaborators } = this.props

    if (!isOwner(project, user.userID)) {
      return <Redirect to={`/projects/${project._id}/collaborators`} />
    }

    if (isInvite) {
      return this.renderInviteCollaboratorPage()
    }

    const acceptedInvitations = invitations.filter(
      (invitation) => !invitation.acceptedAt
    )

    const collaboratorEmails: string[] = []

    const projectCollaborators = buildCollaborators(project, collaborators)

    for (const collaborator of projectCollaborators.values()) {
      collaboratorEmails.push(collaborator.userID.replace('User_', ''))
    }

    const filteredInvitations = acceptedInvitations.filter(
      (invitation) => !collaboratorEmails.includes(invitation.invitedUserEmail)
    )

    return this.renderAddCollaboratorsPage(
      this.state.people,
      filteredInvitations
    )
  }

  private renderInviteCollaboratorPage() {
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
          minSize={300}
          resizerButton={ResizingOutlinerButton}
        >
          <InviteCollaboratorsSidebar
            invitationValues={invitationValues}
            handleCancel={this.handleCancel}
            handleSubmit={this.handleInvitationSubmit}
            invitationSent={invitationSent}
            tokenActions={this.props.tokenActions}
          />
        </Panel>
        <Main>
          <InviteCollaboratorsPage />
        </Main>
      </>
    )
  }

  private renderAddCollaboratorsPage(
    people: UserProfile[],
    acceptedInvitations: ContainerInvitation[]
  ) {
    const { addedCollaboratorsCount, searchText, addedUsers } = this.state

    return (
      <>
        <Panel
          name={'add-collaborators-sidebar'}
          direction={'row'}
          side={'end'}
          minSize={300}
          resizerButton={ResizingOutlinerButton}
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
            tokenActions={this.props.tokenActions}
          />
        </Panel>
        <Main>
          {!searchText.length ? (
            <AddCollaboratorsPage
              addedCollaboratorsCount={addedCollaboratorsCount}
            />
          ) : (
            <SearchCollaboratorsPage searchText={searchText} />
          )}
        </Main>
      </>
    )
  }

  private buildPeople = () => {
    const { projectID } = this.props.match.params

    const { project, projects, collaborators } = this.props

    const otherProjects = projects.filter(
      (project) => project._id !== projectID
    )

    const projectCollaborators = buildCollaborators(project, collaborators)

    const otherProjectCollaborators: UserProfile[] = []

    for (const otherProject of otherProjects) {
      const otherCollaborators = buildCollaborators(otherProject, collaborators)

      otherProjectCollaborators.push(...otherCollaborators)
    }

    const onlyOtherProjectCollaborators = difference(
      otherProjectCollaborators,
      projectCollaborators
    )

    return [...new Set(onlyOtherProjectCollaborators)]
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

    trackEvent({
      category: 'Invitations',
      action: 'Send',
      label: `projectID=${projectID}`,
    })

    this.props.history.push(`/projects/${projectID}/collaborators`, {
      infoMessage: 'Invitation was sent.',
    })
  }
}

export default CollaboratorPageContainer
