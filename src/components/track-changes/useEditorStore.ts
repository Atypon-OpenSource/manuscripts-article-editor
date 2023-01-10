/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
} from '@manuscripts/transform'
import {
  trackChangesPluginKey,
  TrackChangesState,
} from '@manuscripts/track-changes-plugin'
import { Command, EditorState } from 'prosemirror-state'
import create from 'zustand'
import { combine } from 'zustand/middleware'

interface EmptySnapshotState {
  view?: ManuscriptEditorView
  editorState?: ManuscriptEditorState
  trackState: TrackChangesState | undefined | null
}
interface SnapshotState {
  view: ManuscriptEditorView
  editorState: ManuscriptEditorState
  trackState: TrackChangesState | undefined | null
}

function getState(state: EmptySnapshotState) {
  if (state.view === undefined || state.editorState === undefined) {
    throw Error('Trying to access uninitialized useEditorStore')
  }
  return state as SnapshotState
}

export const useEditorStore = create(
  combine(
    {
      view: undefined,
      editorState: undefined,
      trackState: undefined,
    } as EmptySnapshotState,
    (set, get) => ({
      init(view: ManuscriptEditorView) {
        const editorState = view.state,
          trackState = trackChangesPluginKey.getState(view.state)
        set({ view, editorState, trackState })
      },
      state: () => getState(get()),
      execCmd(cmd: Command) {
        const { view } = getState(get())
        cmd(view.state, view.dispatch)
      },
      docToJSON() {
        return getState(get()).editorState.doc.toJSON()
      },
      hydrateDocFromJSON(doc: Record<string, any>) {
        const { view } = getState(get())
        const state = EditorState.create({
          doc: view.state.schema.nodeFromJSON(doc),
          plugins: view.state.plugins,
        })
        view.updateState(state)
        set({ editorState: state })
      },
      setEditorState(newState: ManuscriptEditorState) {
        const state = {
          editorState: newState,
          trackState: trackChangesPluginKey.getState(newState),
        }
        set(state)
        return state
      },
    })
  )
)
