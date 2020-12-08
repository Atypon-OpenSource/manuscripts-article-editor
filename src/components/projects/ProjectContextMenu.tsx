/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
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
  deleteProject: (project: Project) => void
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
    {(user) => {
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
          <DropdownElement
            disabled={!owner}
            onClick={() => deleteProject(project)}
          >
            Delete
          </DropdownElement>
        </React.Fragment>
      )
    }}
  </UserData>
)

export default withModal(ProjectContextMenu)
