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
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { TokenActions } from '../../data/TokenData'
import { projectInvite, projectUninvite, updateUserRole } from '../../lib/api'
import { buildCollaborators } from '../../lib/collaborators'
import { ProjectRole } from '../../lib/roles'
import { Main } from '../Page'
import { CollaboratorDetailsPage } from './CollaboratorsPage'
import CollaboratorsSidebar from './CollaboratorsSidebar'

interface State {
  error: string | null
  selectedCollaborator: UserProfile | null
}

interface Props {
  invitations: ContainerInvitation[]
  project: Project
  user: UserProfileWithAvatar
  collaborators: Map<string, UserProfileWithAvatar>
  tokenActions: TokenActions
}

interface RouteLocationState {
  infoMessage?: string
}

type CombinedProps = Props &
  RouteComponentProps<
    {
      projectID: string
    },
    {},
    RouteLocationState
  >

class CollaboratorsPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    error: null,
    selectedCollaborator: null,
  }

  public render() {
    const { selectedCollaborator } = this.state
    const { state } = this.props.location

    const infoMessage = state ? state.infoMessage : undefined

    const {
      invitations,
      project,
      user,
      collaborators,
      tokenActions,
    } = this.props

    const acceptedInvitations = invitations.filter(
      invitation => !invitation.acceptedAt
    )

    const projectCollaborators = buildCollaborators(project, collaborators)

    return (
      <>
        <CollaboratorsSidebar
          projectCollaborators={projectCollaborators}
          invitations={acceptedInvitations}
          project={project}
          user={user}
          updateUserRole={this.updateUserRole}
          projectInvite={this.projectInvite}
          projectUninvite={this.projectUninvite}
          handleAddCollaborator={this.handleAddCollaborator}
          handleClickCollaborator={this.handleClickCollaborator}
          tokenActions={tokenActions}
          infoMessage={infoMessage}
        />
        <Main>
          <CollaboratorDetailsPage
            project={project}
            user={user}
            collaboratorsCount={
              projectCollaborators.length + invitations.length
            }
            handleAddCollaborator={this.handleAddCollaborator}
            selectedCollaborator={selectedCollaborator}
            manageProfile={this.manageProfile}
          />
        </Main>
      </>
    )
  }

  private handleAddCollaborator = () => {
    const { projectID } = this.props.match.params

    this.props.history.push(`/projects/${projectID}/collaborators/add`)
  }

  private updateUserRole = async (
    selectedRole: ProjectRole | null,
    userID: string
  ) => {
    const { projectID } = this.props.match.params

    await updateUserRole(projectID, selectedRole, userID)
  }

  private projectInvite = async (
    email: string,
    role: string,
    name?: string,
    message?: string
  ) => {
    const { projectID } = this.props.match.params

    await projectInvite(
      projectID,
      [
        {
          email,
          name,
        },
      ],
      role,
      message
    )
  }

  private projectUninvite = async (invitationID: string) => {
    await projectUninvite(invitationID)
  }

  private handleClickCollaborator = (selectedCollaborator: UserProfile) => {
    this.setState({ selectedCollaborator })
  }

  private manageProfile = () => this.props.history.push('/profile')
}

export default CollaboratorsPageContainer
