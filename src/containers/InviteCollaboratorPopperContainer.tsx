import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import InviteCollaboratorPopper from '../components/InviteCollaboratorPopper'
import { CustomPopper } from '../components/Popper'
import { projectInvite, projectUninvite } from '../lib/api'
import { ProjectInvitation } from '../types/components'

interface Props {
  invitation: ProjectInvitation
  popperProps: PopperChildrenProps
  openPopper: () => void
}

class InviteCollaboratorPopperContainer extends React.Component<Props> {
  public render() {
    const { invitation, popperProps } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <InviteCollaboratorPopper
          invitedUserName={invitation.invitedUserName!}
          handleUpdateRole={this.handleUpdateRole}
          handleUninvite={this.handleUninvite}
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
  }

  private handleUninvite = async () => {
    const { openPopper, invitation } = this.props

    await projectUninvite(invitation.id)

    openPopper()
  }
}

export default InviteCollaboratorPopperContainer
