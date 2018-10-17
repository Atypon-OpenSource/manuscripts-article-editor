import React from 'react'
import { ProjectInvitation } from '../../types/models'
import { CollaboratorRolePopper } from './CollaboratorRolePopper'
import { UninviteCollaboratorPopper } from './UninviteCollaboratorPopper'
import UpdateRolePageContainer from './UpdateRolePageContainer'

export type Mode = 'invite' | 'uninvite'

interface State {
  selectedRole: string
  selectedMode: Mode
}

interface Props {
  invitation: ProjectInvitation
  handleUpdateRole: (role: string) => Promise<void>
  handleUninvite: () => Promise<void>
  handleOpenModal: () => void
  updateRoleIsOpen: boolean
}

class InviteCollaboratorPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole: this.props.invitation.role,
    selectedMode: 'invite',
  }

  public render() {
    const { selectedRole, selectedMode } = this.state
    const { invitation, updateRoleIsOpen } = this.props

    return selectedMode === 'invite' && !updateRoleIsOpen ? (
      <CollaboratorRolePopper
        handleRoleChange={this.handleRoleChange}
        selectedRole={selectedRole}
        switchMode={() => this.setMode('uninvite')}
        removeText={'Cancel invitation'}
      />
    ) : updateRoleIsOpen ? (
      <UpdateRolePageContainer
        updating={updateRoleIsOpen}
        selectedRole={selectedRole}
        handleUpdateRole={this.props.handleUpdateRole}
        handleCancel={this.handleCancel}
      />
    ) : (
      <UninviteCollaboratorPopper
        invitedUserName={invitation.invitedUserName!}
        handleUninvite={this.handleUninvite}
        switchMode={() => this.setMode('invite')}
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
      selectedRole: this.props.invitation.role,
    })
  }

  private setMode = (selectedMode: Mode) => {
    this.setState({ selectedMode, selectedRole: this.state.selectedRole })
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
