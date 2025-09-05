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

import { InlineNodesSelection, NodesSelection } from '@manuscripts/body-editor'
import {
  CHANGE_OPERATION,
  CHANGE_STATUS,
  RootChange,
  trackCommands,
} from '@manuscripts/track-changes-plugin'
import { Command, NodeSelection, TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { state } from '../../store'

export const setSelectedSuggestion = (
  suggestions: RootChange,
  getState: () => state
) => {
  const editor = getState().editor
  const state = editor.state
  const view = editor.view
  const tr = state.tr
  if (suggestions[0].dataTracked.operation === CHANGE_OPERATION.structure) {
    tr.setSelection(
      new NodesSelection(
        state.doc.resolve(suggestions[0].from),
        state.doc.resolve(suggestions[suggestions.length - 1].to)
      )
    )
  } else if (suggestions.length > 1) {
    tr.setSelection(
      new InlineNodesSelection(
        state.doc.resolve(suggestions[0].from),
        state.doc.resolve(suggestions[suggestions.length - 1].to)
      )
    )
  } else if (suggestions[0].type === 'text-change') {
    const pos = suggestions[0].to
    tr.setSelection(TextSelection.create(state.doc, pos, pos))
  } else {
    tr.setSelection(NodeSelection.create(state.doc, suggestions[0].from))
  }

  view?.focus()
  try {
    view?.dispatch(tr.scrollIntoView())
  } catch (e) {
    console.warn(
      "Unable to select a node and scroll to it. Check if it's visible. Error: " +
        e
    )
  }
}

export const setChangeStatus = (
  changes: RootChange,
  status: CHANGE_STATUS,
  execCmd: (cmd: Command, hookView?: EditorView) => void
) => {
  const ids: string[] = []

  changes.map((change) => {
    ids.push(change.id)
    if (
      change.type === 'node-change' &&
      !(change.dataTracked.operation === CHANGE_OPERATION.node_split)
    ) {
      change.children.forEach((child) => {
        // this to make sure we don't lose changes that are paired with other changes like node split
        if (
          status === 'rejected' &&
          change.dataTracked.operation === CHANGE_OPERATION.delete &&
          child.dataTracked.operation === CHANGE_OPERATION.reference
        ) {
          return
        }
        ids.push(child.id)
      })
    }
  })
  execCmd(trackCommands.setChangeStatuses(status, ids))
}
