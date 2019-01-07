import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { buildCollaborators } from '../../lib/collaborators'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { Main, Page } from '../Page'
import { CollaboratorDetailsPage } from './CollaboratorsPage'
import CollaboratorsSidebar from './CollaboratorsSidebar'

interface State {
  isSettingsOpen: boolean
  error: string | null
  hoveredID: string
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
    isSettingsOpen: false,
    error: null,
    hoveredID: '',
    selectedCollaborator: null,
  }

  public render() {
    const { isSettingsOpen, hoveredID, selectedCollaborator } = this.state

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
          isSettingsOpen={isSettingsOpen}
          openPopper={this.openPopper}
          handleAddCollaborator={this.handleAddCollaborator}
          handleHover={this.handleHover}
          hoveredID={hoveredID}
          handleClickCollaborator={this.handleClickCollaborator}
          selectedCollaborator={selectedCollaborator}
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

  private handleClickCollaborator = (selectedCollaborator: UserProfile) => {
    this.setState({ selectedCollaborator })
  }

  private manageProfile = () => this.props.history.push('/profile')
}

export default withModels<Props>(CollaboratorPageContainer)
