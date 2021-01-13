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

import { PopperManager, Viewer } from '@manuscripts/manuscript-editor'
import {
  ActualManuscriptNode,
  ManuscriptNode,
} from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  Model,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { RxAttachment } from '@manuscripts/rxdb'
import { History } from 'history'
import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { JsonModel } from '../../pressroom/importers'
import { ThemeProvider } from '../../theme/ThemeProvider'
import IntlProvider from '../IntlProvider'
import { EditorStyles } from '../projects/EditorStyles'

interface Props {
  browserHistory: History
  project: Project
  manuscript: Manuscript
  currentSnapshot: {
    manuscripts: Manuscript[]
    modelMap: Map<string, JsonModel>
    doc: ManuscriptNode
  }
  user: UserProfile
}

const renderReactComponent = (
  child: React.ReactChild,
  container: HTMLElement
) => {
  ReactDOM.render(
    <IntlProvider>
      <ThemeProvider>{child}</ThemeProvider>
    </IntlProvider>,
    container
  )
}

export const HistoricalManuscriptView: React.FC<Props> = ({
  currentSnapshot,
  project,
  manuscript,
  browserHistory,
  user,
}) => {
  const modelMap = currentSnapshot.modelMap
  const doc = currentSnapshot.doc
  const [popper, setPopper] = useState<PopperManager>()

  useEffect(() => {
    setPopper(new PopperManager())
  }, [])

  const getModel = useCallback(
    (id: string) => {
      if (!modelMap) {
        return
      }
      return modelMap.get(id)
    },
    [modelMap]
  ) as (id: string) => any
  const getManuscript = useCallback(() => manuscript, [manuscript])
  const getCurrentUser = useCallback(() => user, [user])

  const allAttachments = useCallback(
    (id: string): Promise<Array<RxAttachment<Model>>> => {
      if (!modelMap) {
        return Promise.resolve([])
      }
      const model = modelMap.get(id)
      if (!model || !model.attachment) {
        return Promise.resolve([])
      }
      return Promise.resolve([
        (model.attachment as unknown) as RxAttachment<Model>,
      ])
    },
    [modelMap]
  )

  const locale = manuscript.primaryLanguageCode || 'en-GB'

  if (!modelMap || !doc || !popper) {
    return null
  }

  return (
    <EditorStyles modelMap={modelMap}>
      <Viewer
        projectID={project._id}
        history={browserHistory}
        doc={doc as ActualManuscriptNode}
        modelMap={modelMap}
        getModel={getModel}
        popper={popper}
        getManuscript={getManuscript}
        getLibraryItem={getModel}
        getCurrentUser={getCurrentUser}
        locale={locale}
        renderReactComponent={renderReactComponent}
        unmountReactComponent={ReactDOM.unmountComponentAtNode}
        allAttachments={allAttachments}
        components={{}}
      />
    </EditorStyles>
  )
}
