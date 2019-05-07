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
import { CustomPopper } from '../Popper'
import CollaboratorSettingsPopper from './CollaboratorSettingsPopper'

interface Props {
  project: Project
  collaborator: UserProfile
  popperProps: PopperChildrenProps
  openPopper: () => void
  handleOpenModal: () => void
  updateUserRole: (role: string) => Promise<void>
  updateRoleIsOpen: boolean
  handleRemove: () => Promise<void>
}

class CollaboratorSettingsPopperContainer extends React.Component<Props> {
  public render() {
    const {
      collaborator,
      popperProps,
      project,
      handleOpenModal,
      updateRoleIsOpen,
      updateUserRole,
      handleRemove,
    } = this.props

    return (
      <CustomPopper popperProps={popperProps}>
        <CollaboratorSettingsPopper
          collaborator={collaborator}
          project={project}
          handleUpdateRole={updateUserRole}
          handleRemove={handleRemove}
          handleOpenModal={handleOpenModal}
          updateRoleIsOpen={updateRoleIsOpen}
        />
      </CustomPopper>
    )
  }
}

export default CollaboratorSettingsPopperContainer
