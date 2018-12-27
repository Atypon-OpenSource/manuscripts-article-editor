import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { CustomPopper } from '../Popper'
import InviteCollaboratorPopper from './InviteCollaboratorPopper'

interface Props {
  invitation: ProjectInvitation
  popperProps: PopperChildrenProps
  openPopper: () => void
  handleOpenModal: () => void
  projectInvite: (
    email: string,
    role: string,
    name?: string,
    message?: string
  ) => Promise<void>
  projectUninvite: (invitationID: string) => Promise<void>
  updateRoleIsOpen: boolean
}

class InviteCollaboratorPopperContainer extends React.Component<Props> {
  public render() {
    const {
      invitation,
      popperProps,
      updateRoleIsOpen,
      handleOpenModal,
    } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <InviteCollaboratorPopper
          invitation={invitation}
          handleUpdateRole={this.handleUpdateRole}
          handleUninvite={this.handleUninvite}
          updateRoleIsOpen={updateRoleIsOpen}
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
