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
  TrackChangesStatus,
  trackCommands,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ChangeList } from './change-list/ChangeList'
import { ChangesControls } from './ChangesControls'
import { SnapshotsList } from './snapshots/SnapshotsList'
import { TrackOptions } from './TrackOptions'
import { useAuthStore } from '../../quarterback/useAuthStore'
import { useCommentStore } from '../../quarterback/useCommentStore'
import { useDocStore } from '../../quarterback/useDocStore'
import { useEditorStore } from './useEditorStore'
import useTrackOptions from './useTrackOptions'

import '@manuscripts/track-changes-plugin/src/styles.css'

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
  const [showPending, setShowPending] = useState(true)
  const [showAccepted, setShowAccepted] = useState(true)
  const [showRejected, setShowRejected] = useState(true)
  useEffect(() => {
    async function findOrCreateDoc(docId: string) {
      await authenticate()
      await listComments(docId)
    }
    if (user) {
      execCmd(trackCommands.setUserID(getTrackUser().id))
    }
    if (options.disableTrack) {
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.disabled))
    }
    currentDocument && findOrCreateDoc(currentDocument.manuscriptID)
  }, [])
  useEffect(() => {
    // check whether track-changes tab is opened, then fetch/create doc if it doesn't exist
    // as well as re-auth quarterback user incase it failed on initial mount
    execCmd(trackCommands.setUserID(options.user.id))
  }, [options])
  useEffect(() => {
    if (options.disableTrack) {
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.disabled))
    } else {
      execCmd(trackCommands.setTrackingStatus(TrackChangesStatus.enabled))
    }
  }, [options.disableTrack])

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

  return (
    <RightSide>
      <TrackOptions options={options} setOptions={setOptions} />
      <h3>Controls</h3>
      <ChangesControls className="changes-controls" />
      <SnapshotsList />
      <ChangeList
        changes={changeSet?.pending || []}
        isVisible={showPending}
        title="Pending"
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
        toggleVisibility={() => setShowPending((v) => !v)}
      />
      <ChangeList
        changes={changeSet?.accepted || []}
        isVisible={showAccepted}
        title="Accepted"
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
        toggleVisibility={() => setShowAccepted((v) => !v)}
      />
      <ChangeList
        changes={changeSet?.rejected || []}
        isVisible={showRejected}
        title="Rejected"
        handleAcceptChange={handleAcceptChange}
        handleRejectChange={handleRejectChange}
        handleResetChange={handleResetChange}
        toggleVisibility={() => setShowRejected((v) => !v)}
      />
    </RightSide>
  )
}

const RightSide = styled.div`
  margin: 1rem;
`
