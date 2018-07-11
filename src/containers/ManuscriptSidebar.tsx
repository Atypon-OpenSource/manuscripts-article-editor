import * as React from 'react'
import debounceRender from 'react-debounce-render'
import { Link } from 'react-router-dom'
import { DraggableTreeProps } from '../components/DraggableTree'
import Panel from '../components/Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import { styled } from '../theme'
import { Manuscript, Project } from '../types/components'
// import ComponentsStatusContainer from './ComponentsStatusContainer'
import ManuscriptOutlineContainer from './ManuscriptOutlineContainer'

interface Props {
  project: Project
  manuscript: Manuscript
}

const ProjectTitle = SidebarTitle.extend`
  font-size: 110%;
  color: black;
`

const ProjectLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const DebouncedManuscriptOutlineContainer = debounceRender(
  ManuscriptOutlineContainer,
  500
)

const ManuscriptSidebar: React.SFC<Props & DraggableTreeProps> = ({
  doc,
  manuscript,
  onDrop,
  project,
}) => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <Sidebar>
      <SidebarHeader>
        <ProjectTitle>
          <ProjectLink to={`/projects/${project.id}`}>
            {project.title || 'Untitled Project'}
          </ProjectLink>
        </ProjectTitle>
      </SidebarHeader>

      <SidebarContent>
        <DebouncedManuscriptOutlineContainer
          manuscript={manuscript}
          doc={doc}
          onDrop={onDrop}
        />
        {/*<ComponentsStatusContainer />*/}
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default ManuscriptSidebar
