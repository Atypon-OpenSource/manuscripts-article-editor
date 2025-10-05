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

import React from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'

const TrackChangesOn = styled.div`

  .track-changes--control {
    display: none;
    position: absolute;
    z-index: 1;
  }

  .track-changes--control > button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${(props) =>
      props.theme.colors.button.secondary.background.default};
    border: 1px solid
      ${(props) => props.theme.colors.button.secondary.border.default};
    color: ${(props) => props.theme.colors.button.secondary.color.default};
    width: 2em;
    height: 2em;
    border-radius: 50%;
    cursor: pointer;
  }

  .track-changes--control > button:hover {
    background: ${(props) =>
      props.theme.colors.button.default.background.hover} !important;
  }

  .track-changes--control > button > svg {
    display: inline-flex;
    width: 1.2em;
    height: 1.2em;
  }
  }
`

const TrackChangesReadOnly = styled(TrackChangesOn)`
  .track-changes--control {
    display: none !important;
  }
`

const TrackChangesRejectOnly = styled(TrackChangesOn)`
  [data-action='accept'] {
    display: none !important;
  }
`

const TrackChangesOff = styled.div`
  .track-changes--control {
    display: none !important;
  }
`

const Actions = styled.div<{ selector: string }>`
  .pending:hover .track-changes--control:is(${(props) => props.selector}),
  .track-changes--control:is(${(props) => props.selector}):hover {
    display: inline-flex;
  }
`

const trackChangesCssSelector = (ids: string[]) => {
  return ids.map((id) => `[data-changeid="${id}"]`).join(',\n')
}

export const TrackChangesStyles: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const can = usePermissions()
  const [{ user, trackState }] = useStore((store) => ({
    user: store.user,
    trackState: store.trackState,
  }))

  const { changeSet } = trackState || {}
  const suggestedChangesSelector = trackChangesCssSelector(
    changeSet?.pending ? changeSet?.pending.map((change) => change.id) : []
  )

  const mySuggestedChangesSelector = trackChangesCssSelector(
    changeSet?.pending
      ? changeSet?.pending
          .filter((change) => change.dataTracked.authorID == user?._id)
          .map((change) => change.id)
      : []
  )

  if (can.editWithoutTracking) {
    return <TrackChangesOff>{children}</TrackChangesOff>
  }

  if (can.handleSuggestion) {
    return (
      <TrackChangesOn>
        <Actions selector={suggestedChangesSelector}>{children}</Actions>
      </TrackChangesOn>
    )
  }

  if (can.rejectOwnSuggestion) {
    return (
      <TrackChangesRejectOnly>
        <Actions selector={mySuggestedChangesSelector}>{children}</Actions>
      </TrackChangesRejectOnly>
    )
  }

  return <TrackChangesReadOnly>{children}</TrackChangesReadOnly>
}
