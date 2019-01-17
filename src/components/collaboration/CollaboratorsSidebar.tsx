import AddAuthor from '@manuscripts/assets/react/AddAuthor'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { darkGrey, salomieYellow } from '../../colors'
import { initials } from '../../lib/name'
import { getUserRole, isOwner, ProjectRole } from '../../lib/roles'
import { styled, ThemedProps } from '../../theme'
import { Avatar } from '../Avatar'
import Panel from '../Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarPersonContainer,
  SidebarTitle,
} from '../Sidebar'
import CollaboratorSettingsButton from './CollaboratorSettingsButton'
import InvitedCollaboratorSettingsButton from './InvitedCollaboratorSettingsButton'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const CollaboratorInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const CollaboratorName = styled.div`
  font-size: 120%;
  color: ${(props: ThemedDivProps) => props.theme.colors.sidebar.text.primary};
  font-weight: 500;
`

const CollaboratorRole = styled.div`
  font-size: 14px;
  color: ${(props: ThemedDivProps) =>
    props.theme.colors.sidebar.text.secondary};
`

const AddCollaboratorButton = styled.button`
  display: flex;
  margin: 8px 0px 8px 4px;
  font-size: 14px;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px 8px;

  &:hover use {
    fill: ${salomieYellow};
  }
`

const AddCollaboratorText = styled.div`
  padding-left: 8px;
  font-weight: 500;
`

const CollaboratorData = styled.div`
  padding-left: 8px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const Invited = styled.div`
  display: flex;
  font-size: 12px;
  color: ${(props: ThemedDivProps) => props.theme.colors.sidebar.label};
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
`

interface Props {
  project: Project
  collaborators: UserProfile[]
  invitations: ProjectInvitation[]
  user: UserProfile
  projectInvite: (
    email: string,
    role: string,
    name?: string,
    message?: string
  ) => Promise<void>
  projectUninvite: (invitationID: string) => Promise<void>
  updateUserRole: (role: ProjectRole | null, userID: string) => Promise<void>
  handleAddCollaborator: () => void
  handleClickCollaborator: (selectedCollaborator: UserProfile) => void
}

interface State {
  isSettingsOpen: boolean
  hoveredID: string
  selectedID: string
}

class CollaboratorsSidebar extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isSettingsOpen: false,
    hoveredID: '',
    selectedID: '',
  }

  public render() {
    const {
      project,
      collaborators,
      invitations,
      user,
      updateUserRole,
      projectInvite,
      projectUninvite,
      handleAddCollaborator,
    } = this.props

    const { hoveredID, selectedID } = this.state

    return (
      <Panel
        name={'collaborators-sidebar'}
        direction={'row'}
        side={'end'}
        minSize={250}
      >
        <Sidebar>
          <SidebarHeader>
            <SidebarTitle>Collaborators</SidebarTitle>
          </SidebarHeader>

          {isOwner(project, user.userID) && (
            <AddCollaboratorButton onClick={handleAddCollaborator}>
              <AddAuthor />

              <AddCollaboratorText>New Collaborator</AddCollaboratorText>
            </AddCollaboratorButton>
          )}

          <SidebarContent>
            {invitations.map(invitation => (
              <SidebarPersonContainer
                key={invitation._id}
                onMouseEnter={() => this.handleHover(invitation._id)}
                onMouseLeave={() => this.handleHover()}
              >
                <UserDataContainer>
                  <Avatar size={45} color={darkGrey} />
                  <CollaboratorData>
                    <CollaboratorName>
                      {invitation.invitedUserName ||
                        invitation.invitedUserEmail}
                    </CollaboratorName>
                    <CollaboratorRole>{invitation.role}</CollaboratorRole>
                  </CollaboratorData>
                </UserDataContainer>
                <InvitedContainer>
                  <Invited>Invited</Invited>
                  {(hoveredID === invitation._id ||
                    selectedID === invitation._id) &&
                    isOwner(project, user.userID) && (
                      <InvitedCollaboratorSettingsButton
                        invitation={invitation}
                        projectInvite={projectInvite}
                        projectUninvite={projectUninvite}
                        openPopper={this.openPopper}
                      />
                    )}
                </InvitedContainer>
              </SidebarPersonContainer>
            ))}
            {!!collaborators &&
              collaborators.map((collaborator: UserProfileWithAvatar) => (
                <SidebarPersonContainer
                  key={collaborator._id}
                  selected={selectedID === collaborator.userID}
                  onMouseEnter={() => this.handleHover(collaborator.userID)}
                  onMouseLeave={() => this.handleHover()}
                  onClick={() => this.handleClickCollaborator(collaborator)}
                >
                  <UserDataContainer>
                    <Avatar
                      src={collaborator.avatar}
                      size={45}
                      color={darkGrey}
                    />
                    <CollaboratorData>
                      {user.userID !== collaborator.userID ? (
                        <CollaboratorName>
                          <CollaboratorInitial>
                            {initials(collaborator.bibliographicName)}
                          </CollaboratorInitial>
                          {collaborator.bibliographicName.family}
                        </CollaboratorName>
                      ) : (
                        <CollaboratorName>You</CollaboratorName>
                      )}
                      <CollaboratorRole>
                        {getUserRole(project, collaborator.userID)}
                      </CollaboratorRole>
                    </CollaboratorData>
                  </UserDataContainer>
                  {(hoveredID === collaborator.userID ||
                    selectedID === collaborator.userID) &&
                    isOwner(project, user.userID) && (
                      <CollaboratorSettingsButton
                        project={project}
                        collaborator={collaborator}
                        openPopper={this.openPopper}
                        updateUserRole={updateUserRole}
                      />
                    )}
                </SidebarPersonContainer>
              ))}
          </SidebarContent>
        </Sidebar>
      </Panel>
    )
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

  private handleClickCollaborator = (collaborator: UserProfile) => {
    this.props.handleClickCollaborator(collaborator)
    this.setState({ selectedID: collaborator.userID })
  }
}

export default CollaboratorsSidebar
