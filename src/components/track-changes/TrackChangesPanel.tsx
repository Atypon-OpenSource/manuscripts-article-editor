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
import { NodeSelection, TextSelection } from 'prosemirror-state'
import React, { useEffect, useState } from 'react'

import { useExecCmd } from '../../hooks/use-track-attrs-popper'
import { useStore } from '../../store'
import { SnapshotsDropdown } from '../inspector/SnapshotsDropdown'
import { SortByDropdown } from './SortByDropdown'
import { SuggestionList } from './suggestion-list/SuggestionList'

export function TrackChangesPanel() {
  const [sortBy, setSortBy] = useState('Date')

  const [{ editorSelectedSuggestion, editor, trackState }, dispatch] = useStore(
    (store) => ({
      editorSelectedSuggestion: store.editorSelectedSuggestion,
      editor: store.editor,
      trackState: store.trackState,
    })
  )

  const execCmd = useExecCmd()

  const { changeSet } = trackState || {}

  function handleSort(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setSortBy(event.currentTarget.value)
  }

  function handleAcceptChange(c: TrackedChange) {
    const ids = [c.id]
    if (c.type === 'node-change') {
      c.children.forEach((child) => {
        ids.push(child.id)
      })
    }
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, ids))
  }
  function handleRejectChange(c: TrackedChange) {
    const ids = [c.id]
    if (c.type === 'node-change') {
      c.children.forEach((child) => {
        ids.push(child.id)
      })
    }
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.rejected, ids))
  }
  function handleResetChange(c: TrackedChange) {
    const ids = [c.id]
    if (c.type === 'node-change') {
      c.children.forEach((child) => {
        ids.push(child.id)
      })
    }
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.pending, ids))
  }

  function handleAcceptPending() {
    if (!trackState) {
      return
    }
    const { changeSet } = trackState
    const ids = ChangeSet.flattenTreeToIds(changeSet.pending)
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, ids))
  }

  const isSelectedSuggestion = (suggestion: TrackedChange) => {
    return !!(
      suggestion.id === editorSelectedSuggestion ||
      (suggestion.type === 'node-change' &&
        suggestion.children.find((change) => {
          return change.id === editorSelectedSuggestion
        }))
    )
  }

  const checkSelectedSuggestion = (suggestionList?: TrackedChange[]) => {
    if (suggestionList) {
      suggestionList.forEach((suggestion) => {
        if (isSelectedSuggestion(suggestion)) {
          dispatch({ selectedSuggestion: suggestion.id })
        }
      })
    }
  }

  const handleClickSuggestion = (suggestion: TrackedChange) => {
    const { view, dispatch: editorDispatch } = editor
    if (view) {
      let selection
      if (suggestion.type === 'text-change') {
        selection = TextSelection.create(
          view.state.tr.doc,
          suggestion.from,
          suggestion.to
        )
      } else {
        selection = NodeSelection.create(view.state.tr.doc, suggestion.from)
      }
      editorDispatch(view.state.tr.setSelection(selection).scrollIntoView())
      editor.view && editor.view.focus()
    }
    dispatch({ selectedSuggestion: suggestion.id })
  }

  useEffect(() => {
    checkSelectedSuggestion(changeSet?.pending)
    checkSelectedSuggestion(changeSet?.accepted)
  }, [changeSet, editorSelectedSuggestion]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SnapshotsDropdown />
      <SortByDropdown sortBy={sortBy} handleSort={handleSort} />
      <SuggestionList
        data-cy="suggestions"
        changes={changeSet?.pending || []}
        title="Suggestions"
        sortBy={sortBy}
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
        handleAcceptPending={
          changeSet?.pending.length ? handleAcceptPending : undefined
        }
        handleClickSuggestion={handleClickSuggestion}
      />
      <SuggestionList
        data-cy="suggestions-accepted"
        changes={changeSet?.accepted || []}
        title="Approved Suggestions"
        sortBy={sortBy}
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
        handleClickSuggestion={handleClickSuggestion}
      />
      <SuggestionList
        data-cy="suggestions-rejected"
        changes={changeSet?.rejected || []}
        title="Rejected Suggestions"
        sortBy={sortBy}
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
        handleClickSuggestion={handleClickSuggestion}
      />
    </>
  )
}
