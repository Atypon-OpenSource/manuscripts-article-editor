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

import { ManuscriptToolbar } from '@manuscripts/manuscript-editor'
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
} from '@manuscripts/manuscript-transform'
import { usePermissions } from '@manuscripts/style-guide'
import {
  TitleEditorState,
  TitleEditorView,
  TitleToolbar,
} from '@manuscripts/title-editor'
import React from 'react'

export enum EditorType {
  manuscript = 'manuscript',
  title = 'title',
}
import config from '../../config'

export type EditorStateType = ManuscriptEditorState | TitleEditorState
export type EditorViewType = ManuscriptEditorView | TitleEditorView

// NOTE: the state prop is only used to prompt re-render on state changes
interface Props {
  editor: string
  state: EditorStateType
  view: EditorViewType
}

export const ManuscriptPageToolbar: React.FunctionComponent<Props> = React.memo(
  ({ editor, view }) => {
    const can = usePermissions()
    switch (editor) {
      case EditorType.manuscript:
        return can.seeEditorToolbar ? (
          <ManuscriptToolbar
            can={can}
            view={view as ManuscriptEditorView}
            state={view.state as ManuscriptEditorState}
            dispatch={view.dispatch}
            footnotesEnabled={config.features.footnotes}
          />
        ) : null

      case EditorType.title:
        return <TitleToolbar view={view as TitleEditorView} />

      default:
        return null
    }
  }
)
