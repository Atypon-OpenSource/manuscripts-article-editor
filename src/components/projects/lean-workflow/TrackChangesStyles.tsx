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

import { Correction } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import styled from 'styled-components'

import { trackChangesCssSelector } from '../../../lib/styles'

const getAcceptedControlsSelector = trackChangesCssSelector(
  'track-changes--control'
)

const TrackChangesOn = styled.div<{
  acceptedControlsSelector: string
}>`
  .track-changes--blame {
    background-color: rgba(57, 255, 20, 0.5);
  }
  .track-changes--blame-uncommitted {
    background-color: rgba(255, 218, 20, 0.5);
  }

  .track-changes--blame-point {
    position: relative;
    &::after {
      position: absolute;
      left: -2.5px;
      display: inline-block;
      content: ' ';
      border: 1px solid rgba(255, 0, 0);
      transform: rotate(45deg);
      border-top: none;
      border-left: none;
      width: 5px;
      height: 5px;
    }
  }

  .track-changes--replaced {
    color: rgba(0, 0, 0, 0.5);
    text-decoration: line-through;
  }

  .track-changes--control {
    flex-direction: column;
    align-items: center;
    border: none;
    cursor: pointer;
    vertical-align: middle;
  }

  .track-changes--control svg {
    display: inline-block;
    width: 1em;
    height: 1em;
  }

  ${(props) => props.acceptedControlsSelector} ${(props) =>
    props.acceptedControlsSelector.length ? '{display: none;}' : ''}
`

const TrackChangesReadOnly = styled(TrackChangesOn)`
  .track-changes--control {
    display: none;
  }
`

const TrackChangesOff = styled.div`
  .track-changes--replaced {
    display: none !important;
  }
  .track-changes--control {
    display: none !important;
  }
`

interface Props {
  enabled: boolean
  readOnly: boolean
  corrections: Correction[]
}

export const TrackChangesStyles: React.FC<Props> = ({
  enabled,
  readOnly,
  corrections,
  children,
}) => {
  const acceptedControlsSelector = getAcceptedControlsSelector(
    corrections
      .filter((correction) => correction.status.label === 'accepted')
      .map(({ commitChangeID }) => commitChangeID)
  )

  return enabled && readOnly ? (
    <TrackChangesReadOnly acceptedControlsSelector={acceptedControlsSelector}>
      {children}
    </TrackChangesReadOnly>
  ) : enabled ? (
    <TrackChangesOn acceptedControlsSelector={acceptedControlsSelector}>
      {children}
    </TrackChangesOn>
  ) : (
    <TrackChangesOff>{children}</TrackChangesOff>
  )
}
