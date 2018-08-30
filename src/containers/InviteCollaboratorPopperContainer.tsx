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

  private handleUpdateRole = (role: string) => {
    const {
      invitedUserEmail,
      invitedUserName,
      projectID,
      message,
    } = this.props.invitation

    const userData = {
      email: invitedUserEmail,
      name: invitedUserName,
    }

    return projectInvite(projectID, [userData], role, message).then(
      response => response.data
    )
  }

  private handleUninvite = () => {
    const { openPopper, invitation } = this.props

    return projectUninvite(invitation.id).then(openPopper)
  }
}

export default InviteCollaboratorPopperContainer
