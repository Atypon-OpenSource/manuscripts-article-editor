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
import {
  AlertMessage,
  AlertMessageType,
  Avatar,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { initials } from '../../lib/name'
import { getUserRole, isOwner, ProjectRole } from '../../lib/roles'
import { TokenActions } from '../../store'
import { AddButton } from '../AddButton'
import PageSidebar from '../PageSidebar'
import { SidebarHeader, SidebarPersonContainer } from '../Sidebar'
import CollaboratorSettingsButton from './CollaboratorSettingsButton'
import InvitedCollaboratorSettingsButton from './InvitedCollaboratorSettingsButton'

const CollaboratorInitial = styled.span`
  margin-right: ${(props) => props.theme.grid.unit}px;
  font-weight: ${(props) => props.theme.font.weight.light};
`

const CollaboratorName = styled.div`
  font-size: 120%;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.medium};
`

const CollaboratorRole = styled.div`
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.secondary};
`

const Action = styled.div`
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`

const CollaboratorData = styled.div`
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`

const Invited = styled.div`
  display: flex;
  font-size: ${(props) => props.theme.font.size.small};
  color: ${(props) => props.theme.colors.brand.default};
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`

const AlertMessageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`

interface Props {
  project: Project
  projectCollaborators: UserProfile[]
  invitations: ContainerInvitation[]
  user: UserProfile
  tokenActions: TokenActions
  infoMessage?: string
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
  message: string | undefined
}

class CollaboratorsSidebar extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isSettingsOpen: false,
    hoveredID: '',
    selectedID: '',
    message: undefined,
  }

  public componentDidMount() {
    this.setState({
      message: this.props.infoMessage,
    })
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
      tokenActions,
    } = this.props

    const { hoveredID, selectedID, message } = this.state

    const collaboratorEmails: string[] = projectCollaborators
      .filter((collaborator) => collaborator.email)
      .map((collaborator) => collaborator.email!)

    const filteredInvitations = invitations.filter(
      (invitation) => !collaboratorEmails.includes(invitation.invitedUserEmail)
    )

    return (
      <PageSidebar
        direction={'row'}
        minSize={260}
        name={'collaborators-sidebar'}
        side={'end'}
        sidebarTitle={<SidebarHeader title={'Collaborators'} />}
      >
        {isOwner(project, user.userID) && (
          <Action>
            <AddButton
              action={handleAddCollaborator}
              title="New Collaborator"
              size={'medium'}
            />
          </Action>
        )}

        {message && (
          <AlertMessageContainer>
            <AlertMessage
              type={AlertMessageType.success}
              hideCloseButton={true}
              dismissButton={{
                text: 'OK',
                action: () => {
                  this.setState({
                    message: undefined,
                  })
                },
              }}
            >
              {message}
            </AlertMessage>
          </AlertMessageContainer>
        )}

        {filteredInvitations.map((invitation) => (
          <SidebarPersonContainer
            key={invitation._id}
            onMouseEnter={() => this.handleHover(invitation._id)}
            onMouseLeave={() => this.handleHover()}
          >
            <UserDataContainer>
              <Avatar size={36} color={'#6e6e6e'} />
              <CollaboratorData>
                <CollaboratorName>
                  {invitation.invitedUserName || invitation.invitedUserEmail}
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
                    tokenActions={tokenActions}
                  />
                )}
            </InvitedContainer>
          </SidebarPersonContainer>
        ))}
        {!!projectCollaborators &&
          projectCollaborators.map((collaborator: UserProfileWithAvatar) => (
            <SidebarPersonContainer
              key={collaborator._id}
              selected={selectedID === collaborator.userID}
              onMouseEnter={() => this.handleHover(collaborator.userID)}
              onMouseLeave={() => this.handleHover()}
              onClick={() => this.handleClickCollaborator(collaborator)}
            >
              <UserDataContainer>
                <Avatar src={collaborator.avatar} size={36} color={'#6e6e6e'} />
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
                    tokenActions={tokenActions}
                  />
                )}
            </SidebarPersonContainer>
          ))}
      </PageSidebar>
    )
  }

  private handleHover = (hoveredID = '') => {
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
