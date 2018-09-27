import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import CollaboratorSettingsPopper from '../components/CollaboratorSettingsPopper'
import { CustomPopper } from '../components/Popper'
import { updateUserRole } from '../lib/api'
import { UserProfile } from '../types/components'

interface Props {
  projectID: string
  collaborator: UserProfile
  popperProps: PopperChildrenProps
  openPopper: () => void
}

class CollaboratorSettingsPopperContainer extends React.Component<Props> {
  public render() {
    const { collaborator, popperProps } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <CollaboratorSettingsPopper
          collaborator={collaborator}
          handleUpdateRole={this.handleUpdateRole}
          handleRemove={this.handleRemove}
        />
      </CustomPopper>
    )
  }

  private handleUpdateRole = async (selectedRole: string) => {
    const { collaborator, projectID } = this.props

    await updateUserRole(projectID, selectedRole, collaborator.userID)
  }

  private handleRemove = async () => {
    const { collaborator, openPopper, projectID } = this.props

    await updateUserRole(projectID, null, collaborator.userID)

    openPopper()
  }
}

export default CollaboratorSettingsPopperContainer
