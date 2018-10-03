import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import CollaboratorSettingsPopper from '../components/CollaboratorSettingsPopper'
import { CustomPopper } from '../components/Popper'
import { updateUserRole } from '../lib/api'
import { Project, UserProfile } from '../types/components'

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

    await updateUserRole(project.id, selectedRole, collaborator.userID)
    openPopper()
  }

  private handleRemove = async () => {
    const { collaborator, openPopper, project } = this.props

    await updateUserRole(project.id, null, collaborator.userID)

    openPopper()
  }
}

export default CollaboratorSettingsPopperContainer
