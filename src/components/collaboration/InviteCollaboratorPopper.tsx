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

import { ContainerInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import { CollaboratorRolePopper } from './CollaboratorRolePopper'
import { UninviteCollaboratorPopper } from './UninviteCollaboratorPopper'
import UpdateRolePageContainer from './UpdateRolePageContainer'

export type Mode = 'invite' | 'uninvite'

interface State {
  selectedRole: string
  selectedMode: Mode
}

interface Props {
  invitation: ContainerInvitation
  handleUpdateRole: (role: string) => Promise<void>
  handleUninvite: () => Promise<void>
  handleOpenModal: () => void
  isUpdateRoleOpen: boolean
  resendInvitation: () => Promise<void>
  resendSucceed: boolean | null
}

class InviteCollaboratorPopper extends React.Component<Props, State> {
  public state: State = {
    selectedRole: this.props.invitation.role,
    selectedMode: 'invite',
  }

  public render() {
    const { selectedRole, selectedMode } = this.state
    const { invitation, isUpdateRoleOpen, resendSucceed } = this.props

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
    await this.props.resendInvitation()
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
    await this.props.handleUninvite()

    this.setState({
      selectedMode: 'invite',
      selectedRole: '',
    })
  }
}

export default InviteCollaboratorPopper
