import React from 'react'
import Title from '../editor/manuscript/Title'
import { styled } from '../theme'
import { Project } from '../types/components'
import { DropdownLink } from './Dropdown'

const activeStyle = {
  fontWeight: 800,
}

export const EmptyProjectsDropdownList = styled.div`
  padding: 8px 16px;
`

interface Props {
  handleClose?: React.MouseEventHandler<HTMLElement>
  projects: Project[]
}

export const ProjectsDropdownList: React.SFC<Props> = ({
  handleClose,
  projects,
}) => (
  <React.Fragment>
    {projects.map(project => (
      <DropdownLink
        key={project.id}
        to={`/projects/${project.id}`}
        activeStyle={activeStyle}
        onClick={event => (handleClose ? handleClose(event) : null)}
      >
        <Title value={project.title || 'Untitled Project'} />
      </DropdownLink>
    ))}
  </React.Fragment>
)
