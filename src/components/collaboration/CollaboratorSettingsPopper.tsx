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

import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import { getUserRole, isOwner } from '../../lib/roles'
import { CollaboratorRolePopper } from './CollaboratorRolePopper'
import { RemoveCollaboratorPopper } from './RemoveCollaboratorPopper'
import UpdateRolePageContainer from './UpdateRolePageContainer'

export type Mode = 'role' | 'remove'

interface State {
  selectedRole: string
  selectedMode: Mode
}

interface Props {
  collaborator: UserProfile
  project: Project
  handleUpdateRole: (role: string) => Promise<void>
  handleRemove: () => Promise<void>
  handleOpenModal: () => void
  updateRoleIsOpen: boolean
}

class CollaboratorSettingsPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole:
      getUserRole(this.props.project, this.props.collaborator.userID) || '',
    selectedMode: 'role',
  }

  public render() {
    const { selectedRole, selectedMode } = this.state
    const { collaborator, updateRoleIsOpen, project } = this.props
    const isOnlyOwner =
      project.owners.length === 1 && isOwner(project, collaborator.userID)

    return selectedMode === 'role' && !updateRoleIsOpen ? (
      <CollaboratorRolePopper
        selectedRole={selectedRole}
        handleRoleChange={this.handleRoleChange}
        switchMode={() => this.setMode('remove')}
        removeText={'Remove from project'}
        isOnlyOwner={isOnlyOwner}
      />
    ) : updateRoleIsOpen ? (
      <UpdateRolePageContainer
        updating={updateRoleIsOpen}
        selectedRole={selectedRole}
        handleUpdateRole={this.props.handleUpdateRole}
        handleCancel={this.handleCancel}
      />
    ) : (
      <RemoveCollaboratorPopper
        collaborator={collaborator}
        handleRemove={this.handleRemove}
        switchMode={() => this.setMode('role')}
      />
    )
  }

  private handleRoleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      selectedRole: event.currentTarget.value,
    })
    this.props.handleOpenModal()
  }

  private handleCancel = () => {
    this.props.handleOpenModal()
    this.setState({
      selectedRole:
        getUserRole(this.props.project, this.props.collaborator.userID) || '',
    })
  }

  private setMode = (selectedMode: Mode) => {
    this.setState({ selectedMode })
  }

  private handleRemove = async () => {
    await this.props.handleRemove()

    this.setState({
      selectedMode: 'role',
      selectedRole: '',
    })
  }
}

export default CollaboratorSettingsPopper
