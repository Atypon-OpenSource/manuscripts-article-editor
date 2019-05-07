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
