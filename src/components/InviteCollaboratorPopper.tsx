import React from 'react'
import { CollaboratorRolePopper } from './CollaboratorRolePopper'
import { UninviteCollaboratorPopper } from './UninviteCollaboratorPopper'

export type Mode = 'invite' | 'uninvite'

interface State {
  selectedRole: string
  selectedMode: Mode
}

interface Props {
  invitedUserName: string
  handleUpdateRole: (role: string) => Promise<void>
  handleUninvite: () => Promise<void>
}

class InviteCollaboratorPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole: '',
    selectedMode: 'invite',
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
    const { invitedUserName } = this.props

    return selectedMode === 'invite' ? (
      <CollaboratorRolePopper
        handleRoleChange={this.handleRoleChange}
        selectedRole={selectedRole}
        switchMode={() => this.setMode('uninvite')}
        removeText={'Uninvite Collaborator'}
      />
    ) : (
      <UninviteCollaboratorPopper
        invitedUserName={invitedUserName}
        handleUninvite={this.handleUninvite}
        switchMode={() => this.setMode('invite')}
      />
    )
  }

  private handleRoleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      selectedRole: event.currentTarget.value,
    })
  }

  private setMode = (selectedMode: Mode) => {
    this.setState({ selectedMode, selectedRole: '' })
  }

  private handleUninvite = async () => {
    try {
      await this.props.handleUninvite()

      this.setState({
        selectedMode: 'invite',
        selectedRole: '',
      })
    } catch (error) {
      alert(error)
    }
  }
}

export default InviteCollaboratorPopper
