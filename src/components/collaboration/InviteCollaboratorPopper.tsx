import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { CollaboratorRolePopper } from './CollaboratorRolePopper'
import { UninviteCollaboratorPopper } from './UninviteCollaboratorPopper'
import UpdateRolePageContainer from './UpdateRolePageContainer'

export type Mode = 'invite' | 'uninvite'

interface State {
  selectedRole: string
  selectedMode: Mode
  resendSucceed: boolean | null
}

interface Props {
  invitation: ProjectInvitation
  handleUpdateRole: (role: string) => Promise<void>
  handleUninvite: () => Promise<void>
  handleOpenModal: () => void
  isUpdateRoleOpen: boolean
  resendInvitation: () => Promise<void>
}

class InviteCollaboratorPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole: this.props.invitation.role,
    selectedMode: 'invite',
    resendSucceed: null,
  }

  public render() {
    const { selectedRole, selectedMode, resendSucceed } = this.state
    const { invitation, isUpdateRoleOpen } = this.props

    return selectedMode === 'invite' && !isUpdateRoleOpen ? (
      <CollaboratorRolePopper
        handleRoleChange={this.handleRoleChange}
        selectedRole={selectedRole}
        switchMode={() => this.setMode('uninvite')}
        removeText={'Cancel invitation'}
        invitedUserEmail={invitation.invitedUserEmail}
        resendSucceed={resendSucceed}
        resendInvitation={this.handleResendSubmit}
        selectedMode={this.state.selectedMode}
        isOnlyOwner={false}
      />
    ) : isUpdateRoleOpen ? (
      <UpdateRolePageContainer
        updating={isUpdateRoleOpen}
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

  private handleResendSubmit = async () => {
    try {
      await this.props.resendInvitation()
      this.setState({
        resendSucceed: true,
      })
    } catch (error) {
      this.setState({
        resendSucceed: false,
      })
    }
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
