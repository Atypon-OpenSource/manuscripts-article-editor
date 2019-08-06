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
import React, { useCallback, useEffect, useState } from 'react'
import { TokenActions } from '../../data/TokenData'
import { styled } from '../../theme/styled-components'
import { Permissions } from '../../types/permissions'
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
  border-right: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
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
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
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
  openTemplateSelector: (newProject: boolean) => void
  manuscript: Manuscript
  manuscripts: Manuscript[]
  project: Project
  saveProjectTitle: (title: string) => Promise<Project>
  selected: Selected | null
  view?: ManuscriptEditorView
  doc?: ManuscriptNode
  user: UserProfileWithAvatar
  permissions: Permissions
  tokenActions: TokenActions
}

const ManuscriptSidebar: React.FunctionComponent<Props> = ({
  openTemplateSelector,
  doc,
  manuscript,
  manuscripts,
  view,
  permissions,
  project,
  saveProjectTitle,
  selected,
  user,
  tokenActions,
}) => {
  const [sortedManuscripts, setSortedManuscripts] = useState<Manuscript[]>()

  useEffect(() => {
    setSortedManuscripts(manuscripts.sort(lowestPriorityFirst))
  }, [manuscript])

  const handleNewManuscript = useCallback(() => {
    openTemplateSelector(false)
  }, [])

  const handleTitleChange = useCallback(debounce(saveProjectTitle, 1000), [])

  if (!sortedManuscripts) {
    return null
  }

  return (
    <Panel
      name={'sidebar'}
      minSize={200}
      direction={'row'}
      side={'end'}
      hideWhen={'max-width: 900px'}
    >
      <StyledSidebar>
        <SidebarHeader>
          <ProjectTitle>
            <TitleField
              id={'project-title-field'}
              tabIndex={1}
              editable={permissions.write}
              value={project.title || ''}
              handleChange={handleTitleChange}
            />
          </ProjectTitle>
          <ShareProjectButton
            project={project}
            user={user}
            tokenActions={tokenActions}
          />
        </SidebarHeader>

        <SidebarContent>
          {sortedManuscripts.map(item => (
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
          {permissions.write && (
            <AddManuscriptButton onClick={handleNewManuscript}>
              <AddIconContainer>
                <RegularAddIcon width={20} height={21} />
                <AddIconHover width={20} height={21} />
                <ManuscriptAdd>New Manuscript</ManuscriptAdd>
              </AddIconContainer>
            </AddManuscriptButton>
          )}
        </SidebarFooter>
      </StyledSidebar>
    </Panel>
  )
}

export default ManuscriptSidebar
