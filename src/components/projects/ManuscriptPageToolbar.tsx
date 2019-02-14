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

import { ManuscriptToolbar } from '@manuscripts/manuscript-editor'
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
} from '@manuscripts/manuscript-transform'
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
    switch (editor) {
      case EditorType.manuscript:
        return <ManuscriptToolbar view={view} />

      case EditorType.title:
        return <TitleToolbar view={view} />

      default:
        return null
    }
  }
)
