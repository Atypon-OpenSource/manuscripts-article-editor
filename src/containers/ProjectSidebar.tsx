import React from 'react'
import { Link } from 'react-router-dom'
import Panel from '../components/Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import { styled } from '../theme'
import { Manuscript, Project } from '../types/components'

const SidebarManuscript = styled.div`
  padding: 10px 0;
`

const ManuscriptTitle = styled(Link)`
  font-size: 120%;
  color: inherit;
  text-decoration: none;
`

interface Props {
  project: Project
  manuscripts: Manuscript[]
}

const ProjectSidebar: React.SFC<Props> = ({ project, manuscripts }) => (
  <Panel name={'sidebar'} direction={'row'} side={'end'} minSize={200}>
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle>{project.title || 'Untitled'}</SidebarTitle>
      </SidebarHeader>
      <SidebarContent>
        {manuscripts.map(manuscript => (
          <SidebarManuscript key={manuscript.id}>
            <ManuscriptTitle
              to={`/projects/${project.id}/manuscripts/${manuscript.id}`}
            >
              {manuscript.title || 'Untitled'}
            </ManuscriptTitle>
          </SidebarManuscript>
        ))}
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default ProjectSidebar
