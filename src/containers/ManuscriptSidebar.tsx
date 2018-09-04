import * as React from 'react'
import debounceRender from 'react-debounce-render'
import { DraggableTreeProps } from '../components/DraggableTree'
import Panel from '../components/Panel'
import ShareProjectButton from '../components/ShareProjectButton'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import { Selected } from '../editor/lib/utils'
import { TitleField } from '../editor/title/TitleField'
import { Manuscript, Project } from '../types/components'
import ManuscriptOutlineContainer from './ManuscriptOutlineContainer'

interface Props {
  project: Project
  manuscript: Manuscript
  saveProject: (project: Project) => Promise<void>
  selected: Selected | null
}

const ProjectTitle = SidebarTitle.extend`
  font-size: 22px;
  color: #353535;
`

const StyledSidebar = Sidebar.extend`
  background: #f0f6fb;
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
  selected,
}) => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <StyledSidebar>
      <SidebarHeader>
        <ProjectTitle>
          <TitleField
            id={'project-title-field'}
            value={project.title || 'Untitled Project'}
            handleChange={title =>
              saveProject({
                ...project,
                title,
              })
            }
          />
        </ProjectTitle>
        <ShareProjectButton projectID={project.id} />
      </SidebarHeader>

      <SidebarContent>
        <DebouncedManuscriptOutlineContainer
          manuscript={manuscript}
          doc={doc}
          onDrop={onDrop}
          selected={selected}
        />
      </SidebarContent>
    </StyledSidebar>
  </Panel>
)

export default ManuscriptSidebar
