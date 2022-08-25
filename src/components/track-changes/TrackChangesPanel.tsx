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
  enableDebug,
  TrackChangesStatus,
  trackCommands,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import React, { useEffect, useState } from 'react'

import { useAuthStore } from '../../quarterback/useAuthStore'
import { useCommentStore } from '../../quarterback/useCommentStore'
import { useDocStore } from '../../quarterback/useDocStore'
import { SnapshotsDropdown } from '../inspector/SnapshotsDropdown'
import { SortByDropdown } from '../track/SortByDropdown'
import { ChangeList } from './change-list/ChangeList'
import { useEditorStore } from './useEditorStore'
import useTrackOptions from './useTrackOptions'

export function TrackChangesPanel() {
  const { user, authenticate, getTrackUser } = useAuthStore()
  const { execCmd, trackState } = useEditorStore()
  const { listComments } = useCommentStore()
  const { currentDocument } = useDocStore()
  const { changeSet } = trackState || {}
  const { options, setOptions } = useTrackOptions('manuscript-track-options', {
    documentId: currentDocument?.manuscriptID || 'undefined',
    user: getTrackUser(),
  })
  const [sortBy, setSortBy] = useState('Date')

  useEffect(() => {
    async function findOrCreateDoc(docId: string) {
      await authenticate()
      await listComments(docId)
    }
    if (user) {
      execCmd(trackCommands.setUserID(getTrackUser().id))
    }
    if (options.disableTrack && trackState) {
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.disabled))
    }
    if (options.debug && trackState) {
      enableDebug(true)
    }
    if (!trackState) {
      setOptions((old) => ({ ...old, disableTrack: true }))
    }
    currentDocument && findOrCreateDoc(currentDocument.manuscriptID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    // check whether track-changes tab is opened, then fetch/create doc if it doesn't exist
    // as well as re-auth quarterback user incase it failed on initial mount
    execCmd(trackCommands.setUserID(options.user.id))
  }, [options, execCmd])
  useEffect(() => {
    if (options.disableTrack) {
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.disabled))
    } else {
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.enabled))
    }
  }, [options.disableTrack, execCmd])

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

  return (
    <>
      <SnapshotsDropdown />
      <SortByDropdown sortBy={sortBy} handleSort={handleSort} />
      <ChangeList
        changes={changeSet?.pending || []}
        title="Suggestions"
        sortBy={sortBy}
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
        handleAcceptPending={
          changeSet?.pending.length ? handleAcceptPending : undefined
        }
      />
      <ChangeList
        changes={changeSet?.accepted || []}
        title="Approved Suggestions"
        sortBy={sortBy}
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
      />
      <ChangeList
        changes={changeSet?.rejected || []}
        title="Rejected Suggestions"
        sortBy={sortBy}
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
      />
    </>
  )
}
