import {
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptToolbar,
} from '@manuscripts/manuscript-editor'
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
