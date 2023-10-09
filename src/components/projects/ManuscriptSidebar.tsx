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
  findParentNodeWithIdValue,
  ManuscriptOutline,
  OutlineManuscript,
  useEditor,
} from '@manuscripts/body-editor'
import { Manuscript, Project } from '@manuscripts/json-schema'
import { usePermissions } from '@manuscripts/style-guide'
import {
  ManuscriptEditorView,
  UserProfileWithAvatar,
} from '@manuscripts/transform'
import React, { useCallback, useEffect, useState } from 'react'

import { useStore } from '../../store'
import PageSidebar from '../PageSidebar'
import { SortableManuscript } from './SortableManuscript'
import { parse } from '../title/Parse'
import { TitleSchema} from '../title/Schema'

const lowestPriorityFirst = (a: Manuscript, b: Manuscript) => {
  if (a.priority === b.priority) {
    return a.createdAt - b.createdAt
  }

  return Number(a.priority) - Number(b.priority)
}

interface Props {
  openTemplateSelector?: (newProject: boolean) => void
  manuscript: Manuscript
  project: Project
  schema: TitleSchema
  saveProjectTitle?: (title: string) => Promise<Project>
  view?: ManuscriptEditorView
  state: ReturnType<typeof useEditor>['state']
  user: UserProfileWithAvatar
}

const ManuscriptSidebar: React.FunctionComponent<Props> = ({
  state,
  manuscript,
  view,
  project,
  schema,
}) => {
  const [{ manuscripts, saveModel }] = useStore((store) => ({
    manuscripts: store.manuscripts || [],
    saveModel: store.saveModel,
  }))

  const selected = findParentNodeWithIdValue(state.selection)
  const can = usePermissions()

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
      sidebarTitle={''}
      sidebarFooter={''}
    >
      {sortedManuscripts.map((item, index) => (
        <SortableManuscript
          key={item._id}
          index={index}
          item={item}
          setIndex={setIndex}
        >
          {selected && item._id === manuscript._id ? (
            <ManuscriptOutline
              manuscript={manuscript}
              doc={state?.doc || null}
              view={view}
              selected={selected}
              capabilities={can}
            />
          ) : (
            <OutlineManuscript project={project} manuscript={item} schema= {schema} parse={parse}/>
          )}
        </SortableManuscript>
      ))}
    </PageSidebar>
  )
}

export default ManuscriptSidebar
