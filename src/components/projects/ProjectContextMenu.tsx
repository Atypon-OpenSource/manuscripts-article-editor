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

import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import UserData from '../../data/UserData'
import { isOwner, isWriter } from '../../lib/roles'
import { getCurrentUserId } from '../../lib/user'
import { ModalProps, withModal } from '../ModalProvider'
import {
  DropdownElement,
  DropdownLink,
  DropdownSeparator,
} from '../nav/Dropdown'

interface Props {
  closeModal?: () => void
  deleteProject: () => void
  project: Project
  renameProject: () => void
}

const ProjectContextMenu: React.FunctionComponent<Props & ModalProps> = ({
  closeModal,
  deleteProject,
  project,
  renameProject,
}) => (
  <UserData userID={getCurrentUserId()!}>
    {user => {
      const owner = isOwner(project, user.userID)
      const writer = isWriter(project, user.userID)

      return (
        <React.Fragment>
          <DropdownLink to={`/projects/${project._id}`} onClick={closeModal}>
            Open
          </DropdownLink>
          <DropdownElement
            disabled={!(owner || writer)}
            onClick={renameProject}
          >
            Rename
          </DropdownElement>
          <DropdownSeparator />
          <DropdownElement disabled={!owner} onClick={deleteProject}>
            Delete
          </DropdownElement>
        </React.Fragment>
      )
    }}
  </UserData>
)

export default withModal<Props>(ProjectContextMenu)
