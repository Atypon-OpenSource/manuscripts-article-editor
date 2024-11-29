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
  CHANGE_OPERATION,
  CHANGE_STATUS,
  ChangeSet,
  trackCommands,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import React, { useCallback, useState } from 'react'

import useExecCmd from '../../hooks/use-exec-cmd'
import { useStore } from '../../store'
import { SnapshotsDropdown } from '../inspector/SnapshotsDropdown'
import { SortByDropdown } from './SortByDropdown'
import { SuggestionList } from './suggestion-list/SuggestionList'
import { setChangeStatus, setSelectedSuggestion } from './utils'

export const TrackChangesPanel: React.FC = () => {
  const [sortBy, setSortBy] = useState('in Context')

  const [{ trackState, selectedSuggestionID }, _, getState] = useStore(
    (store) => ({
      // @TODO - check if trackstate actually issues some updates and we listen to them
      trackState: store.trackState,
      selectedSuggestionID: store.selectedSuggestionID,
    })
  )

  const handleSelect = useCallback((suggestion: TrackedChange) => {
    setSelectedSuggestion(suggestion, getState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const execCmd = useExecCmd()

  const { changeSet } = trackState || {}

  const handleAccept = useCallback((change: TrackedChange) => {
    setChangeStatus(change, CHANGE_STATUS.accepted, execCmd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReject = useCallback((change: TrackedChange) => {
    setChangeStatus(change, CHANGE_STATUS.rejected, execCmd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAcceptAll = useCallback(() => {
    const trackState = getState().trackState
    if (!trackState) {
      return
    }
    const ids = ChangeSet.flattenTreeToIds(trackState.changeSet.pending)
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.rejected, ids))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SnapshotsDropdown />
      <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
      <SuggestionList
        type="all"
        changes={
          changeSet?.pending.filter(
            (c) => c.dataTracked.operation !== CHANGE_OPERATION.reference
          ) || []
        }
        selectionID={selectedSuggestionID}
        title="Suggestions"
        sortBy={sortBy}
        onAccept={handleAccept}
        onReject={handleReject}
        onAcceptAll={changeSet?.pending.length ? handleAcceptAll : undefined}
        onSelect={handleSelect}
      />
    </>
  )
}
