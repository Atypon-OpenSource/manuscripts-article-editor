import * as React from 'react'
import debounceRender from 'react-debounce-render'
import { DraggableTreeProps } from '../components/DraggableTree'
import Panel from '../components/Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import { TitleField } from '../editor/manuscript/TitleField'
import { Manuscript, Project } from '../types/components'
// import ComponentsStatusContainer from './ComponentsStatusContainer'
import ManuscriptOutlineContainer from './ManuscriptOutlineContainer'

interface Props {
  project: Project
  manuscript: Manuscript
  saveProject: (project: Project) => Promise<void>
}

const ProjectTitle = SidebarTitle.extend`
  font-size: 22px;
  color: #353535;
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
  saveProject,
}) => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <Sidebar
      style={{
        background: '#f0f6fb',
      }}
    >
      <SidebarHeader>
        <ProjectTitle>
          <TitleField
            id="project-title"
            value={project.title || 'Untitled Project'}
            handleChange={title =>
              saveProject({
                ...project,
                title,
              })
            }
          />
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
