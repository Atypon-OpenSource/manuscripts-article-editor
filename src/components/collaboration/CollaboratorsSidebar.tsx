import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { darkGrey } from '../../colors'
import AddAuthor from '../../icons/add-author'
import { initials } from '../../lib/name'
import { getUserRole, isOwner, ProjectRole } from '../../lib/roles'
import { styled } from '../../theme'
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

const CollaboratorInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const CollaboratorName = styled.div`
  font-size: 120%;
  color: #353535;
  font-weight: 500;
`

const CollaboratorRole = styled.div`
  font-size: 14px;
  color: #949494;
`

const CollaboratorSidebar = styled(Sidebar)`
  background-color: #f8fbfe;
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
`

const AddCollaboratorText = styled.div`
  padding-left: 8px;
  font-weight: 500;
`

const CollaboratorData = styled.div`
  padding-left: 3px;
`
const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const Invited = styled.div`
  display: flex;
  font-size: 12px;
  color: #7fb5d5;
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
}

class CollaboratorsSidebar extends React.Component<Props, State> {
  public state = {
    isSettingsOpen: false,
    hoveredID: '',
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
      handleClickCollaborator,
      handleAddCollaborator,
    } = this.props

    const { hoveredID } = this.state

    return (
      <Panel
        name={'collaborators-sidebar'}
        direction={'row'}
        side={'end'}
        minSize={250}
      >
        <CollaboratorSidebar>
          <SidebarHeader>
            <SidebarTitle>Collaborators</SidebarTitle>
          </SidebarHeader>

          {isOwner(project, user.userID) && (
            <AddCollaboratorButton onClick={handleAddCollaborator}>
              <AddAuthor />
              <AddCollaboratorText>Add new collaborator</AddCollaboratorText>
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
                  <Avatar size={45} color={'#585858'} />
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
                  {hoveredID === invitation._id &&
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
                  onMouseEnter={() => this.handleHover(collaborator.userID)}
                  onMouseLeave={() => this.handleHover()}
                  onClick={() => handleClickCollaborator(collaborator)}
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
                  {hoveredID === collaborator.userID &&
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
        </CollaboratorSidebar>
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
}

export default CollaboratorsSidebar
