import React from 'react'
import { NavLink } from 'react-router-dom'
import Panel from '../components/Panel'
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
  font-size: 120%;
`

const SidebarIcon = styled.button`
  border: none;
  background: #fdcd47;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;

  &:hover {
    background: #fda72e;
  }
`

interface Props {
  addProject: React.MouseEventHandler<HTMLButtonElement>
  projects: Project[]
}

const ProjectsSidebar: React.SFC<Props> = ({ addProject, projects }) => (
  <Panel name={'sidebar'} direction={'row'} side={'end'} minSize={200}>
    <Sidebar id="sidebar">
      <SidebarHeader>
        <SidebarTitle id="projects">Projects</SidebarTitle>
        <SidebarIcon onClick={addProject}>
          <Add color={'#fff'} size={16} />
        </SidebarIcon>
      </SidebarHeader>
      <SidebarContent>
        {projects.map((project: Project) => (
          <SidebarProject to={`/projects/${project.id}`} key={project.id}>
            <ProjectTitle>{project.title || 'Untitled'}</ProjectTitle>
          </SidebarProject>
        ))}
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default ProjectsSidebar
