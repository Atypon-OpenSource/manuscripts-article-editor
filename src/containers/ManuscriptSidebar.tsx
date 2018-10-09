import AddIcon from '@manuscripts/assets/react/AddIcon'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import * as React from 'react'
import { manuscriptsBlue, powderBlue } from '../colors'
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
import { DebouncedManuscriptOutlineContainer } from './ManuscriptOutlineContainer'
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

  & .ProseMirror {
    cursor: text;

    &:focus {
      outline: none;
    }

    & .empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Untitled Project';
      pointer-events: none;
    }

    & .empty-node:hover::before {
      color: #999;
    }
  }
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

const StyledAddIcon = styled(AddIcon)`
  transform: scale(0.6);
`

interface Props {
  addManuscript: () => Promise<void>
  manuscript: Manuscript
  manuscripts: Manuscript[]
  project: Project
  saveProject: (project: Project) => Promise<void>
  selected: Selected | null
  view: EditorView | null
  doc: ProsemirrorNode | null
}

const ManuscriptSidebar: React.SFC<Props> = ({
  addManuscript,
  doc,
  manuscript,
  manuscripts,
  view,
  project,
  saveProject,
  selected,
}) => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <Sidebar>
      <SidebarHeader>
        <ProjectTitle>
          <TitleField
            id={'project-title-field'}
            value={project.title}
            handleChange={title =>
              saveProject({
                ...project,
                title,
              })
            }
          />
        </ProjectTitle>
        <ShareProjectButton project={project} />
      </SidebarHeader>

      <SidebarContent>
        {manuscripts.map(item => (
          <SidebarManuscript key={item.id}>
            {item.id === manuscript.id ? (
              <DebouncedManuscriptOutlineContainer
                manuscript={manuscript}
                doc={doc}
                view={view}
                selected={selected}
              />
            ) : (
              <OutlineManuscript project={project} manuscript={item} />
            )}
          </SidebarManuscript>
        ))}

        <AddManuscriptButton onClick={addManuscript}>
          <StyledAddIcon />
          Add Manuscript
        </AddManuscriptButton>
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default ManuscriptSidebar
