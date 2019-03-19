/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  DebouncedManuscriptOutlineContainer,
  OutlineManuscript,
} from '@manuscripts/manuscript-editor'
import {
  ManuscriptEditorView,
  ManuscriptNode,
  Selected,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-transform'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { TitleField } from '@manuscripts/title-editor'
import { debounce } from 'lodash-es'
import * as React from 'react'
import { styled } from '../../theme/styled-components'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import Panel from '../Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTitle,
} from '../Sidebar'
import {
  AddIconContainer,
  AddIconHover,
  RegularAddIcon,
} from './ProjectsListPlaceholder'

const StyledSidebar = styled(Sidebar)`
  background: white;
  border: 1px solid ${props => props.theme.colors.sidebar.background.selected};
  border-bottom: none;
  border-top: none;
`
const ProjectTitle = styled(SidebarTitle)`
  color: ${props => props.theme.colors.sidebar.text.primary};
  font-weight: 450;
  border: 1px solid transparent;
  padding: 4px;
  margin: -4px 0 -4px;
  overflow: hidden;
  flex: 1;

  &:hover {
    border-color: ${props => props.theme.colors.title.border.hovered};
    background: ${props => props.theme.colors.title.background.hovered};
  }

  & .ProseMirror {
    cursor: text;

    &:not(.ProseMirror-focused) {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &:focus {
      outline: none;
    }

    &.empty-node::before {
      position: absolute;
      color: ${props => props.theme.colors.editor.placeholder.default};
      cursor: text;
      content: 'Untitled Project';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: ${props => props.theme.colors.editor.placeholder.hovered};
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

const ManuscriptAdd = styled.div`
  padding-left: 10px;
`

const lowestPriorityFirst = (a: Manuscript, b: Manuscript) => {
  if (a.priority === b.priority) {
    return a.createdAt - b.createdAt
  }

  return Number(a.priority) - Number(b.priority)
}

interface Props {
  openTemplateSelector: () => void
  manuscript: Manuscript
  manuscripts: Manuscript[]
  project: Project
  saveProjectTitle: (title: string) => Promise<Project>
  selected: Selected | null
  view?: ManuscriptEditorView
  doc?: ManuscriptNode
  user: UserProfileWithAvatar
}

const ManuscriptSidebar: React.FunctionComponent<Props> = ({
  openTemplateSelector,
  doc,
  manuscript,
  manuscripts,
  view,
  project,
  saveProjectTitle,
  selected,
  user,
}) => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <StyledSidebar>
      <SidebarHeader>
        <ProjectTitle>
          <TitleField
            id={'project-title-field'}
            value={project.title || ''}
            handleChange={debounce(async title => {
              await saveProjectTitle(title)
            }, 1000)}
          />
        </ProjectTitle>
        <ShareProjectButton project={project} user={user} />
      </SidebarHeader>

      <SidebarContent>
        {manuscripts.sort(lowestPriorityFirst).map(item => (
          <SidebarManuscript key={item._id}>
            {item._id === manuscript._id ? (
              <DebouncedManuscriptOutlineContainer
                manuscript={manuscript}
                doc={doc || null}
                view={view || null}
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
          <AddIconContainer>
            <RegularAddIcon width={20} height={21} />
            <AddIconHover width={20} height={21} />
            <ManuscriptAdd>New Manuscript</ManuscriptAdd>
          </AddIconContainer>
        </AddManuscriptButton>
      </SidebarFooter>
    </StyledSidebar>
  </Panel>
)

export default ManuscriptSidebar
