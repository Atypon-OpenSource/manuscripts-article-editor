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

  private handleUpdateRole(selectedRole: string) {
    const { collaborator, projectID } = this.props

    return updateUserRole(projectID, collaborator.userID, selectedRole).then(
      response => response.data
    )
  }

  private handleRemove = () => {
    const { collaborator, openPopper, projectID } = this.props

    return updateUserRole(projectID, collaborator.userID, null).then(() =>
      openPopper()
    )
  }
}

export default CollaboratorSettingsPopperContainer
