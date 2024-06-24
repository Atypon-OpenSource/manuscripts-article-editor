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
  CHANGE_STATUS,
  ChangeSet,
  trackCommands,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import { schema } from '@manuscripts/transform'
import { NodeSelection, TextSelection } from 'prosemirror-state'
import React, { useState } from 'react'

import useExecCmd from '../../hooks/use-exec-cmd'
import { useStore } from '../../store'
import { SnapshotsDropdown } from '../inspector/SnapshotsDropdown'
import { SortByDropdown } from './SortByDropdown'
import { SuggestionList } from './suggestion-list/SuggestionList'

export const scrollToElement = (element: HTMLElement) => {
  const editorBodyElement = document.querySelector('.editor-body')
  const childRect = element.getBoundingClientRect()
  const parentRect = editorBodyElement!.getBoundingClientRect()

  if (childRect.bottom > window.innerHeight || childRect.top < 150) {
    let childTopOffset = childRect.top - parentRect.top
    // to center the element vertically within the viewport.
    childTopOffset =
      childTopOffset - (window.innerHeight - childRect.height) / 2
    const scrollToTop = editorBodyElement!.scrollTop + childTopOffset

    editorBodyElement!.scrollTo({ top: scrollToTop, behavior: 'smooth' })
  }
}
export const TrackChangesPanel: React.FC = () => {
  const [sortBy, setSortBy] = useState('in Context')

  const [{ editor, trackState, selectedSuggestionID }] = useStore((store) => ({
    editor: store.editor,
    trackState: store.trackState,
    selectedSuggestionID: store.selectedSuggestionID,
  }))

  const setSelectedSuggestion = (suggestion: TrackedChange) => {
    const state = editor.state
    const view = editor.view
    const tr = state.tr
    if (suggestion.type === 'text-change') {
      const pos = suggestion.to
      tr.setSelection(TextSelection.create(state.doc, pos, pos))
    } else {
      tr.setSelection(NodeSelection.create(state.doc, suggestion.from))
    }
    const node = tr.doc.nodeAt(tr.selection.$from.pos)

    if (node && node.type === schema.nodes.bibliography_item) {
      const bibItemElement = document.querySelector(
        `[id="${node.attrs.id}"]`
      ) as HTMLElement
      bibItemElement && scrollToElement(bibItemElement)
    } else {
      tr.scrollIntoView()
    }
    view?.focus()
    view?.dispatch(tr)
  }

  const execCmd = useExecCmd()

  const { changeSet } = trackState || {}

  const setChangeStatus = (change: TrackedChange, status: CHANGE_STATUS) => {
    const ids = [change.id]
    if (change.type === 'node-change') {
      change.children.forEach((child) => {
        ids.push(child.id)
      })
    }
    execCmd(trackCommands.setChangeStatuses(status, ids))
  }

  const handleAccept = (change: TrackedChange) => {
    setChangeStatus(change, CHANGE_STATUS.accepted)
  }

  const handleReject = (change: TrackedChange) => {
    setChangeStatus(change, CHANGE_STATUS.rejected)
  }

  const handleReset = (change: TrackedChange) => {
    setChangeStatus(change, CHANGE_STATUS.pending)
  }

  const handleAcceptAll = () => {
    if (!changeSet) {
      return
    }
    const ids = ChangeSet.flattenTreeToIds(changeSet.pending)
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, ids))
  }

  return (
    <>
      <SnapshotsDropdown />
      <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
      <SuggestionList
        type="all"
        changes={changeSet?.pending || []}
        selectionID={selectedSuggestionID}
        title="Suggestions"
        sortBy={sortBy}
        onAccept={handleAccept}
        onReject={handleReject}
        onReset={handleReset}
        onAcceptAll={changeSet?.pending.length ? handleAcceptAll : undefined}
        onSelect={setSelectedSuggestion}
      />
      <SuggestionList
        type="accepted"
        changes={changeSet?.accepted || []}
        title="Approved Suggestions"
        sortBy={sortBy}
        onAccept={handleAccept}
        onReject={handleReject}
        onReset={handleReset}
        onSelect={setSelectedSuggestion}
      />
      <SuggestionList
        type="rejected"
        changes={changeSet?.rejected || []}
        title="Rejected Suggestions"
        sortBy={sortBy}
        onAccept={handleAccept}
        onReject={handleReject}
        onReset={handleReset}
        onSelect={() => {
          /* noop */
        }}
      />
    </>
  )
}
