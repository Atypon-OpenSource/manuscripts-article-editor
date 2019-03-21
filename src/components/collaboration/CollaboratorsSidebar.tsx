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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Avatar } from '@manuscripts/style-guide'
import React from 'react'
import { initials } from '../../lib/name'
import { getUserRole, isOwner, ProjectRole } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import Panel from '../Panel'
import {
  AddIconContainer,
  AddIconHover,
  RegularAddIcon,
} from '../projects/ProjectsListPlaceholder'
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
  color: ${props => props.theme.colors.sidebar.text.primary};
  font-weight: 500;
`

const CollaboratorRole = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.sidebar.text.secondary};
`

const AddCollaboratorButton = styled.button`
  display: flex;
  margin: 8px 0px 8px 3px;
  font-size: 14px;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px 8px;
`

const AddCollaboratorText = styled.div`
  padding-left: 10px;
`

const CollaboratorData = styled.div`
  padding-left: 9px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const Invited = styled.div`
  display: flex;
  font-size: 12px;
  color: ${props => props.theme.colors.sidebar.label};
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledSidebar = styled(Sidebar)`
  background: white;
  border-right: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
`

interface Props {
  project: Project
  projectCollaborators: UserProfile[]
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
      projectCollaborators,
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
        <StyledSidebar data-cy={'sidebar'}>
          <SidebarHeader>
            <SidebarTitle>Collaborators</SidebarTitle>
          </SidebarHeader>

          {isOwner(project, user.userID) && (
            <AddCollaboratorButton onClick={handleAddCollaborator}>
              <AddIconContainer>
                <RegularAddIcon width={36} height={36} />
                <AddIconHover width={36} height={36} />
                <AddCollaboratorText>New Collaborator</AddCollaboratorText>
              </AddIconContainer>
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
                  <Avatar size={36} />
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
            {!!projectCollaborators &&
              projectCollaborators.map(
                (collaborator: UserProfileWithAvatar) => (
                  <SidebarPersonContainer
                    key={collaborator._id}
                    selected={selectedID === collaborator.userID}
                    onMouseEnter={() => this.handleHover(collaborator.userID)}
                    onMouseLeave={() => this.handleHover()}
                    onClick={() => this.handleClickCollaborator(collaborator)}
                  >
                    <UserDataContainer>
                      <Avatar src={collaborator.avatar} size={36} />
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
                )
              )}
          </SidebarContent>
        </StyledSidebar>
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
