import AddIcon from '@manuscripts/assets/react/AddIcon'
import * as React from 'react'
import debounceRender from 'react-debounce-render'
import { manuscriptsBlue, powderBlue } from '../colors'
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
import { styled } from '../theme'
import { Manuscript, Project } from '../types/components'
import ManuscriptOutlineContainer from './ManuscriptOutlineContainer'
import { OutlineManuscript } from './OutlineManuscript'

const ProjectTitle = styled(SidebarTitle)`
  color: #353535;
  border: 1px solid transparent;
  padding: 4px;
  margin: -4px 0 -4px;

  &:hover {
    border-color: ${manuscriptsBlue};
    background: ${powderBlue};
  }
`

const StyledSidebar = styled(Sidebar)`
  background: #f0f6fb;
`

const SidebarManuscript = styled.div`
  margin-bottom: 16px;
`

const AddManuscriptButton = styled.button`
  display: flex;
  margin: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px 8px;
  letter-spacing: -0.3px;
`

const DebouncedManuscriptOutlineContainer = debounceRender(
  ManuscriptOutlineContainer,
  500
)

interface Props {
  addManuscript: () => Promise<void>
  manuscript: Manuscript
  manuscripts: Manuscript[]
  project: Project
  saveProject: (project: Project) => Promise<void>
  selected: Selected | null
}

const ManuscriptSidebar: React.SFC<Props & DraggableTreeProps> = ({
  addManuscript,
  doc,
  manuscript,
  manuscripts,
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
        {manuscripts.map(item => (
          <SidebarManuscript key={item.id}>
            {item.id === manuscript.id ? (
              <DebouncedManuscriptOutlineContainer
                manuscript={manuscript}
                doc={doc}
                onDrop={onDrop}
                selected={selected}
              />
            ) : (
              <OutlineManuscript project={project} manuscript={item} />
            )}
          </SidebarManuscript>
        ))}

        <AddManuscriptButton onClick={addManuscript}>
          <AddIcon transform={'scale(0.6)'} />
          Add Manuscript
        </AddManuscriptButton>
      </SidebarContent>
    </StyledSidebar>
  </Panel>
)

export default ManuscriptSidebar
