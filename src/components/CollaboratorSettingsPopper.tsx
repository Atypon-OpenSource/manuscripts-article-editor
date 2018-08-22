import React from 'react'
import { UserProfile } from '../types/components'
import { CollaboratorRolePopper } from './CollaboratorRolePopper'
import { RemoveCollaboratorPopper } from './RemoveCollaboratorPopper'

export type Mode = 'role' | 'remove'

interface State {
  selectedRole: string
  selectedMode: Mode
}

interface Props {
  collaborator: UserProfile
  handleUpdateRole: (role: string) => Promise<void>
  handleRemove: () => Promise<void>
}

class CollaboratorSettingsPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole: '',
    selectedMode: 'role',
  }

  public async componentWillUnmount() {
    const { selectedRole } = this.state

    if (selectedRole) {
      try {
        await this.props.handleUpdateRole(selectedRole)
      } catch (error) {
        alert(error)
      }
    }
  }

  public render() {
    const { selectedRole, selectedMode } = this.state
    const { collaborator } = this.props

    return selectedMode === 'role' ? (
      <CollaboratorRolePopper
        selectedRole={selectedRole}
        handleRoleChange={this.handleRoleChange}
        switchMode={() => this.setMode('remove')}
        removeText={'Remove Collaborator'}
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
  }

  private setMode = (selectedMode: Mode) => {
    this.setState({ selectedMode })
  }

  private handleRemove = async () => {
    try {
      await this.props.handleRemove()

      this.setState({
        selectedMode: 'role',
        selectedRole: '',
      })
    } catch (error) {
      alert(error)
    }
  }
}

export default CollaboratorSettingsPopper
