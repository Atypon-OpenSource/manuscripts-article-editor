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
import { dustyGrey, manuscriptsBlue, powderBlue } from '../../colors'
import { styled, ThemedProps } from '../../theme'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import Panel from '../Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ProjectTitle = styled(SidebarTitle)`
  color: ${(props: ThemedDivProps) => props.theme.colors.sidebar.text.primary};
  font-weight: 450;
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
      color: #bbb;
      cursor: text;
      content: 'Untitled Project';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: ${dustyGrey};
    }
  }
`

const SidebarManuscript = styled.div`
  margin-bottom: 16px;
`

const AddManuscriptButton = styled.button`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px 8px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.global.text.primary};
  white-space: nowrap;
  text-overflow: ellipsis;
`

const StyledAddIcon = styled(AddIcon)`
  transform: scale(0.6);
  flex-shrink: 0;
`

interface Props {
  openTemplateSelector: () => void
  manuscript: Manuscript
  manuscripts: Manuscript[]
  project: Project
  saveProject: (project: Project) => Promise<void>
  selected: Selected | null
  view: ManuscriptEditorView | null
  doc: ManuscriptNode | null
}

const ManuscriptSidebar: React.FunctionComponent<Props> = ({
  openTemplateSelector,
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
      </SidebarContent>

      <SidebarFooter>
        <AddManuscriptButton onClick={openTemplateSelector}>
          <StyledAddIcon />
          New Manuscript
        </AddManuscriptButton>
      </SidebarFooter>
    </Sidebar>
  </Panel>
)

export default ManuscriptSidebar
