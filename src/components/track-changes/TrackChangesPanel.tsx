/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import {
  CHANGE_STATUS,
  ChangeSet,
  RootChange,
  trackCommands,
} from '@manuscripts/track-changes-plugin'
import React, { useCallback, useState } from 'react'

import useExecCmd from '../../hooks/use-exec-cmd'
import { useStore } from '../../store'
import { SortByDropdown } from './SortByDropdown'
import { SuggestionList } from './suggestion-list/SuggestionList'
import { setChangeStatus, setSelectedSuggestion } from './utils'

export const TrackChangesPanel: React.FC = () => {
  const [sortBy, setSortBy] = useState('in Context')

  const [{ trackState, selectedSuggestionID, isComparingMode }, _, getState] =
    useStore((store) => ({
      // @TODO - check if trackstate actually issues some updates and we listen to them
      trackState: store.trackState,
      selectedSuggestionID: store.selectedSuggestionID,
      isComparingMode: store.isComparingMode,
    }))

  const handleSelect = useCallback((suggestions: RootChange) => {
    setSelectedSuggestion(suggestions, getState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const execCmd = useExecCmd()

  const { changeSet } = trackState || {}

  const handleAccept = useCallback((changes: RootChange) => {
    setChangeStatus(changes, CHANGE_STATUS.accepted, execCmd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReject = useCallback((changes: RootChange) => {
    setChangeStatus(changes, CHANGE_STATUS.rejected, execCmd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAcceptAll = useCallback(() => {
    const trackState = getState().trackState
    if (!trackState) {
      return
    }
    const ids = ChangeSet.flattenTreeToIds(trackState.changeSet.pending)
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, ids))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const title = isComparingMode ? 'Changes' : 'Suggestions'
  return (
    <>
      <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
      <SuggestionList
        type="all"
        changes={changeSet?.groupChanges || []}
        selectionID={selectedSuggestionID}
        title={title}
        sortBy={sortBy}
        onAccept={(change) => {
          if (!isComparingMode) {
            handleAccept(change)
          }
        }}
        onReject={(change) => {
          if (!isComparingMode) {
            handleReject(change)
          }
        }}
        onAcceptAll={
          isComparingMode
            ? undefined
            : changeSet?.pending.length
            ? handleAcceptAll
            : undefined
        }
        onSelect={handleSelect}
      />
    </>
  )
}
