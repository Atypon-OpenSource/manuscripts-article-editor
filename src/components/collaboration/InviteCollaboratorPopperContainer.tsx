import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { projectInvite, projectUninvite } from '../../lib/api'
import { CustomPopper } from '../Popper'
import InviteCollaboratorPopper from './InviteCollaboratorPopper'

interface Props {
  invitation: ProjectInvitation
  popperProps: PopperChildrenProps
  openPopper: () => void
  handleOpenModal: () => void
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
      projectID,
      message,
    } = this.props.invitation

    await projectInvite(
      projectID,
      [
        {
          email,
          name,
        },
      ],
      role,
      message
    )

    this.props.openPopper()
  }

  private resendInvitation = async () => {
    const {
      invitedUserEmail: email,
      invitedUserName: name,
      projectID,
      message,
      role,
    } = this.props.invitation

    await projectInvite(
      projectID,
      [
        {
          email,
          name,
        },
      ],
      role,
      message
    )
  }

  private handleUninvite = async () => {
    const { openPopper, invitation } = this.props

    await projectUninvite(invitation._id)

    openPopper()
  }
}

export default InviteCollaboratorPopperContainer
