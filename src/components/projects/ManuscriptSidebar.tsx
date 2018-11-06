import AddIcon from '@manuscripts/assets/react/AddIcon'
import {
  DebouncedManuscriptOutlineContainer,
  ManuscriptEditorView,
  ManuscriptNode,
  OutlineManuscript,
  Selected,
} from '@manuscripts/manuscript-editor'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { TitleField } from '@manuscripts/title-editor'
import * as React from 'react'
import { manuscriptsBlue, powderBlue } from '../../colors'
import { styled } from '../../theme'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import Panel from '../Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'

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

    &.empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Untitled Project';
      pointer-events: none;
    }

    &.empty-node:hover::before {
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
  view: ManuscriptEditorView | null
  doc: ManuscriptNode | null
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
            value={project.title || ''}
            handleChange={async title => {
              await saveProject({ ...project, title })
            }}
          />
        </ProjectTitle>
        <ShareProjectButton project={project} />
      </SidebarHeader>

      <SidebarContent>
        {manuscripts.map(item => (
          <SidebarManuscript key={item._id}>
            {item._id === manuscript._id ? (
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
