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

import { CHANGE_STATUS, TrackedChange } from '@manuscripts/track-changes-plugin'
import { NodeSelection, TextSelection } from 'prosemirror-state'

import { PMEditor, state } from '../../store'

export const trackedJoint = ':dataTracked:'

export const stripTracked = (id: string) => {
  return id.split(trackedJoint)[0]
}

export const setSelectedSuggestion = (
  suggestion: TrackedChange,
  getState: () => state
) => {
  const state = getState().state
  const view = getState().view
  const tr = state.tr
  if (suggestion.type === 'text-change') {
    const pos = suggestion.to
    tr.setSelection(TextSelection.create(state.doc, pos, pos))
  } else {
    tr.setSelection(NodeSelection.create(state.doc, suggestion.from))
  }

  view?.focus()
  view?.dispatch(tr.scrollIntoView())
}

export const setChangeStatus = (
  change: TrackedChange,
  status: CHANGE_STATUS
) => {
  const ids = [change.id]
  if (change.type === 'node-change') {
    change.children.forEach((child) => {
      ids.push(child.id)
    })
  }
  execCmd(trackCommands.setChangeStatuses(status, ids))
}
