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

import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { ProjectRole } from '../../lib/roles'
import { CustomPopper } from '../Popper'
import CollaboratorSettingsPopper from './CollaboratorSettingsPopper'

interface Props {
  project: Project
  collaborator: UserProfile
  popperProps: PopperChildrenProps
  openPopper: () => void
  handleOpenModal: () => void
  updateUserRole: (role: ProjectRole | null, userID: string) => Promise<void>
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
    const { collaborator, openPopper, updateUserRole } = this.props

    await updateUserRole(selectedRole as ProjectRole, collaborator.userID)
    openPopper()
  }

  private handleRemove = async () => {
    const { collaborator, openPopper, updateUserRole } = this.props

    await updateUserRole(null, collaborator.userID)
    openPopper()
  }
}

export default CollaboratorSettingsPopperContainer
