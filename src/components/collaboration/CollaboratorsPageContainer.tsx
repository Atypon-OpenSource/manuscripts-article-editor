/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps } from 'react-router'
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
  invitations: ProjectInvitation[]
  project: Project
  user: UserProfileWithAvatar
  collaborators: Map<string, UserProfileWithAvatar>
}

type CombinedProps = Props &
  RouteComponentProps<{
    projectID: string
  }>

class CollaboratorsPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    error: null,
    selectedCollaborator: null,
  }

  public render() {
    const { selectedCollaborator } = this.state
    const { invitations, project, user, collaborators } = this.props

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
