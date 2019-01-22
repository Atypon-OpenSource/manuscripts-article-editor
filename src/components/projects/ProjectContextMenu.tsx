import { Project } from '@manuscripts/manuscripts-json-schema/dist/types'
import React from 'react'
import UserData from '../../data/UserData'
import { isOwner, isWriter } from '../../lib/roles'
import { getCurrentUserId } from '../../lib/user'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { ModalProps, withModal } from '../ModalProvider'
import {
  DropdownElement,
  DropdownLink,
  DropdownSeparator,
} from '../nav/Dropdown'

interface Props {
  project: Project
  deleteProject: () => void
  renameProject: () => void
}

const ProjectContextMenu: React.FunctionComponent<
  Props & ModelsProps & ModalProps
> = ({ project, deleteProject, renameProject }) => (
  <UserData userID={getCurrentUserId()!}>
    {user => {
      const owner = isOwner(project, user.userID)
      const writer = isWriter(project, user.userID)

      return (
        <React.Fragment>
          <DropdownLink to={`/projects/${project._id}`}>Open</DropdownLink>
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

export default withModal<Props>(withModels(ProjectContextMenu))
