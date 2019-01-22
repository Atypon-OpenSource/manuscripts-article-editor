import {
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema/dist/types'
import React from 'react'
import { isOwner, isWriter } from '../../lib/roles'
import {
  DropdownElement,
  DropdownLink,
  DropdownSeparator,
} from '../nav/Dropdown'

interface Props {
  project: Project
  user: UserProfile
  renameProject: () => void
  deleteProject: () => void
}

const ProjectContextMenuList: React.FunctionComponent<Props> = ({
  project,
  user,
  renameProject,
  deleteProject,
}) => {
  const owner = isOwner(project, user.userID)
  const writer = isWriter(project, user.userID)

  return (
    <React.Fragment>
      <DropdownLink to={`/projects/${project._id}`}>Open</DropdownLink>
      <DropdownElement disabled={!(owner || writer)} onClick={renameProject}>
        Rename
      </DropdownElement>
      <DropdownSeparator />
      <DropdownElement disabled={!owner} onClick={deleteProject}>
        Delete
      </DropdownElement>
    </React.Fragment>
  )
}

export default ProjectContextMenuList
