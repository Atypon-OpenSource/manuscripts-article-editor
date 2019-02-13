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

import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { CustomPopper } from '../Popper'
import InviteCollaboratorPopper from './InviteCollaboratorPopper'

interface Props {
  invitation: ProjectInvitation
  popperProps: PopperChildrenProps
  isUpdateRoleOpen: boolean
  openPopper: () => void
  handleOpenModal: () => void
  projectInvite: (
    email: string,
    role: string,
    name?: string,
    message?: string
  ) => Promise<void>
  projectUninvite: (invitationID: string) => Promise<void>
}

class InviteCollaboratorPopperContainer extends React.Component<Props> {
  public render() {
    const {
      invitation,
      popperProps,
      isUpdateRoleOpen,
      handleOpenModal,
    } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <InviteCollaboratorPopper
          invitation={invitation}
          handleUpdateRole={this.handleUpdateRole}
          handleUninvite={this.handleUninvite}
          isUpdateRoleOpen={isUpdateRoleOpen}
          handleOpenModal={handleOpenModal}
          resendInvitation={this.resendInvitation}
        />
      </CustomPopper>
    )
  }

  private handleUpdateRole = async (role: string) => {
    const {
      invitedUserEmail: email,
      invitedUserName: name,
      message,
    } = this.props.invitation

    const { projectInvite, openPopper } = this.props

    await projectInvite(email, role, name, message)

    openPopper()
  }

  private resendInvitation = async () => {
    const {
      invitedUserEmail: email,
      invitedUserName: name,
      message,
      role,
    } = this.props.invitation

    const { projectInvite } = this.props

    await projectInvite(email, role, name, message)
  }

  private handleUninvite = async () => {
    const { openPopper, invitation, projectUninvite } = this.props

    await projectUninvite(invitation._id)

    openPopper()
  }
}

export default InviteCollaboratorPopperContainer
