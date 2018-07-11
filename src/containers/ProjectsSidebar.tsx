import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import Add from '../icons/add'
import { styled } from '../theme'
import { Project } from '../types/components'

const SidebarProject = styled(NavLink)`
  padding: 10px;
  border-bottom: 1px solid #eee;
  color: inherit;
  text-decoration: none;
`

const ProjectTitle = styled.div`
  font-size: 19px;
  font-weight: 500;
  font-style: normal;
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: #353535;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    color: #000;
  }

  &:focus {
    outline: none;
  }
`
const AddIcon = styled.span`
  background: #fdcd47;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 6px;
  width: 19px;
  height: 19px;
  cursor: pointer;

  &:hover {
    background: #fda72e;
  }
`

const SidebarAction = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`

const SidebarActionTitle = styled.span`
  display: flex;
  align-items: center;
  padding-left: 11px;
  padding-bottom: 2px;
  font-weight: 600;
  font-size: 14px;
`

interface Props {
  addProject: React.MouseEventHandler<HTMLButtonElement>
  projects: Project[]
}

const ProjectsSidebar: React.SFC<Props> = ({ addProject, projects }) => (
  <Sidebar id="sidebar">
    <SidebarHeader>
      <SidebarTitle id="projects">Projects</SidebarTitle>
    </SidebarHeader>
    <SidebarAction>
      <AddButton onClick={addProject}>
        <AddIcon>
          <Add color={'#fff'} size={19} />
        </AddIcon>
        <SidebarActionTitle>Add New Project</SidebarActionTitle>
      </AddButton>
    </SidebarAction>
    <SidebarContent>
      {projects.map(project => (
        <SidebarProject to={`/projects/${project.id}`} key={project.id}>
          <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
        </SidebarProject>
      ))}
    </SidebarContent>
  </Sidebar>
)

export default ProjectsSidebar
