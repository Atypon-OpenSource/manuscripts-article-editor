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
} from '@manuscripts/track-changes-plugin'
import React from 'react'
import styled from 'styled-components'

import { getDocWithoutTrackContent } from '../../quarterback/getDocWithoutTrackContent'
import { usePouchStore } from '../../quarterback/usePouchStore'
import { useSnapshotStore } from '../../quarterback/useSnapshotStore'
import { useEditorStore } from './useEditorStore'

interface IProps {
  className?: string
}

export function ChangesControls(props: IProps) {
  const { className } = props
  const { execCmd, trackState, docToJSON } = useEditorStore()
  const { saveSnapshot } = useSnapshotStore()

  function handleAcceptPending() {
    if (!trackState) {
      return
    }
    const { changeSet } = trackState
    const ids = ChangeSet.flattenTreeToIds(changeSet.pending)
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, ids))
  }
  function handleRejectPending() {
    if (!trackState) {
      return
    }
    const { changeSet } = trackState
    const ids = ChangeSet.flattenTreeToIds(changeSet.pending)
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.rejected, ids))
  }
  function handleReset() {
    const ids = trackState?.changeSet.changes.map((c) => c.id) || []
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.pending, ids))
  }
  async function handleSnapshot() {
    const resp = await saveSnapshot(docToJSON())
    if ('data' in resp) {
      execCmd(trackCommands.applyAndRemoveChanges())
      setTimeout(() => {
        const state = useEditorStore.getState().editorState
        if (!state) {
          return
        }
        usePouchStore.getState().saveDoc(getDocWithoutTrackContent(state))
      })
    }
  }
  return (
    <Container className={className}>
      <button onClick={() => handleAcceptPending()}>Accept pending</button>
      <button onClick={() => handleRejectPending()}>Reject pending</button>
      <button onClick={() => handleReset()}>Reset</button>
      <button onClick={() => handleSnapshot()}>Apply all and snapshot</button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  button {
    margin: 0.05rem;
  }
`
