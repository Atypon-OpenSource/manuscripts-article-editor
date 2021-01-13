/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  ManuscriptOutline,
  OutlineManuscript,
} from '@manuscripts/manuscript-editor'
import {
  ManuscriptEditorView,
  ManuscriptNode,
  Selected,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-transform'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { Title, TitleField } from '@manuscripts/title-editor'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { TokenActions } from '../../data/TokenData'
import { Permissions } from '../../types/permissions'
import { AddButton } from '../AddButton'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import PageSidebar from '../PageSidebar'
import { SidebarHeader } from '../Sidebar'
import { SortableManuscript } from './SortableManuscript'

const CustomizedSidebarHeader = styled.div`
  align-items: flex-start;
  display: flex;
`

const ProjectTitle = styled.div`
  flex: 1;
  overflow: hidden;
  padding-right: ${(props) => props.theme.grid.unit}px;
  font-size: 24px;
  line-height: 32px;

  & .ProseMirror {
    cursor: text;

    &:not(.ProseMirror-focused) {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &.empty-node::before {
      position: absolute;
      color: ${(props) => props.theme.colors.text.muted};
      cursor: text;
      content: 'Untitled Project';
      pointer-events: none;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.empty-node:hover::before {
      color: ${(props) => props.theme.colors.text.secondary};
    }
  }
`

const lowestPriorityFirst = (a: Manuscript, b: Manuscript) => {
  if (a.priority === b.priority) {
    return a.createdAt - b.createdAt
  }

  return Number(a.priority) - Number(b.priority)
}

interface Props {
  openTemplateSelector?: (newProject: boolean) => void
  manuscript: Manuscript
  manuscripts: Manuscript[]
  project: Project
  saveProjectTitle?: (title: string) => Promise<Project>
  selected: Selected | null
  view?: ManuscriptEditorView
  doc?: ManuscriptNode
  user: UserProfileWithAvatar
  permissions: Permissions
  tokenActions: TokenActions
  saveModel: (model: Manuscript) => Promise<Manuscript>
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
  saveModel,
}) => {
  const [sortedManuscripts, setSortedManuscripts] = useState<Manuscript[]>()

  useEffect(() => {
    setSortedManuscripts(manuscripts.sort(lowestPriorityFirst))
  }, [manuscripts])

  const setIndex = useCallback(
    (id: string, index: number) => {
      const manuscript = manuscripts.find((item) => item._id === id)!

      manuscript.priority = index

      manuscripts.sort(lowestPriorityFirst)

      for (const [index, manuscript] of manuscripts.entries()) {
        if (manuscript.priority !== index) {
          saveModel({
            ...manuscript,
            priority: index,
          }).catch((error) => {
            console.error(error)
          })
        }
      }
    },
    [saveModel, manuscripts]
  )

  if (!sortedManuscripts) {
    return null
  }

  return (
    <PageSidebar
      direction={'row'}
      hideWhen={'max-width: 900px'}
      minSize={260}
      name={'sidebar'}
      side={'end'}
      sidebarTitle={
        <SidebarHeader
          title={
            <CustomizedSidebarHeader>
              <ProjectTitle>
                {saveProjectTitle ? (
                  <TitleField
                    id={'project-title-field'}
                    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                    tabIndex={1}
                    editable={permissions.write}
                    value={project.title || ''}
                    handleChange={debounce(saveProjectTitle, 1000)}
                  />
                ) : (
                  <Title
                    id="project-title"
                    editable={false}
                    value={project.title || ''}
                  />
                )}
              </ProjectTitle>
              <ShareProjectButton
                project={project}
                user={user}
                tokenActions={tokenActions}
              />
            </CustomizedSidebarHeader>
          }
        />
      }
      sidebarFooter={
        permissions.write && openTemplateSelector ? (
          <AddButton
            action={() => openTemplateSelector(false)}
            size={'small'}
            title={'New Manuscript'}
          />
        ) : (
          <></>
        )
      }
    >
      {sortedManuscripts.map((item, index) => (
        <SortableManuscript
          key={item._id}
          index={index}
          item={item}
          setIndex={setIndex}
        >
          {item._id === manuscript._id ? (
            <ManuscriptOutline
              manuscript={manuscript}
              doc={doc || null}
              view={view}
              selected={selected}
              permissions={permissions}
            />
          ) : (
            <OutlineManuscript project={project} manuscript={item} />
          )}
        </SortableManuscript>
      ))}
    </PageSidebar>
  )
}

export default ManuscriptSidebar
