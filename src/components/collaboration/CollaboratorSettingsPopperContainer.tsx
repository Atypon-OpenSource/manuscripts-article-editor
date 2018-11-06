import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { updateUserRole } from '../../lib/api'
import { CustomPopper } from '../Popper'
import CollaboratorSettingsPopper from './CollaboratorSettingsPopper'

interface Props {
  project: Project
  collaborator: UserProfile
  popperProps: PopperChildrenProps
  openPopper: () => void
  handleOpenModal: () => void
  updateRoleIsOpen: boolean
}

class CollaboratorSettingsPopperContainer extends React.Component<Props> {
  public render() {
    const {
      collaborator,
      popperProps,
      project,
      handleOpenModal,
      updateRoleIsOpen,
    } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <CollaboratorSettingsPopper
          collaborator={collaborator}
          project={project}
          handleUpdateRole={this.handleUpdateRole}
          handleRemove={this.handleRemove}
          handleOpenModal={handleOpenModal}
          updateRoleIsOpen={updateRoleIsOpen}
        />
      </CustomPopper>
    )
  }

  private handleUpdateRole = async (selectedRole: string) => {
    const { collaborator, project, openPopper } = this.props

    await updateUserRole(project._id, selectedRole, collaborator.userID)
    openPopper()
  }

  private handleRemove = async () => {
    const { collaborator, openPopper, project } = this.props

    await updateUserRole(project._id, null, collaborator.userID)

    openPopper()
  }
}

export default CollaboratorSettingsPopperContainer
