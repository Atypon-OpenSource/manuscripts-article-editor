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
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { Main, Page } from '../Page'
import { CollaboratorDetailsPage } from './CollaboratorsPage'
import CollaboratorsSidebar from './CollaboratorsSidebar'

interface State {
  error: string | null
  userMap: Map<string, UserProfile>
  selectedCollaborator: UserProfile | null
}

interface Props {
  invitations: ProjectInvitation[]
  project: Project
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
    error: null,
    userMap: new Map(),
    selectedCollaborator: null,
  }

  public render() {
    const { selectedCollaborator } = this.state
    const { invitations, project, user, users } = this.props

    const acceptedInvitations = invitations.filter(
      invitation => !invitation.acceptedAt
    )

    const collaborators = buildCollaborators(project, users)

    return (
      <Page project={project}>
        <CollaboratorsSidebar
          collaborators={collaborators}
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
            collaboratorsCount={collaborators.length + invitations.length}
            handleAddCollaborator={this.handleAddCollaborator}
            selectedCollaborator={selectedCollaborator}
            manageProfile={this.manageProfile}
          />
        </Main>
      </Page>
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

export default withModels<Props>(CollaboratorPageContainer)
