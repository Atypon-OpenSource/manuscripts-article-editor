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

const blameSelector = trackChangesCssSelector('track-changes--blame')

const TrackChangesOn = styled.div`
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

  .track-changes--control {
    display: none;
    position: absolute;
  }

  .track-changes--blame:hover:not(.track-changes--blame-uncommitted)
    + .track-changes--control,
  .track-changes--blame.track-changes--focused:not(.track-changes--blame-uncommitted)
    + .track-changes--control,
  .track-changes--control:hover {
    display: inline-flex;
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
      props.theme.colors.button.secondary.background.hover};
  }

  .track-changes--control > button > svg {
    display: inline-flex;
    width: 1.2em;
    height: 1.2em;
  }

  .track-changes--annotation-control {
    display: inline-flex;
    position: relative;
    width: 0;
    height: 0;
    & > button {
      position: absolute;
      top: -2em;
      background: transparent;
      display: inline-flex;
      height: auto;
      width: auto;
      padding: 0;
      border: none;
      cursor: pointer;
      & > svg {
        width: 1.2em;
        height: 1.2em;
        display: inline-flex;
        color: #fffcdb;
      }
    }
    &.track-changes--focused > button > svg {
      color: #ffeb07;
    }
  }
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

const ToDoDots = styled.div<{ selector: string }>`
  ${(props) => props.selector} {
    position: relative;
    &::after {
      content: ' ';
      position: absolute;
      left: 100%;
      top: -3px;
      display: block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: ${(props) => props.theme.colors.text.warning};
    }
  }
`

interface Props {
  corrections: Correction[]
  enabled: boolean
  readOnly: boolean
}

export const TrackChangesStyles: React.FC<Props> = ({
  enabled,
  readOnly,
  corrections,
  children,
}) => {
  const suggestedChangesSelector = blameSelector(
    corrections
      .filter((corr) => corr.status.label === 'proposed')
      .map((corr) => corr.commitChangeID)
  )

  return enabled && readOnly ? (
    <TrackChangesReadOnly>{children}</TrackChangesReadOnly>
  ) : enabled ? (
    <TrackChangesOn>
      <ToDoDots selector={suggestedChangesSelector}>{children}</ToDoDots>
    </TrackChangesOn>
  ) : (
    <TrackChangesOff>{children}</TrackChangesOff>
  )
}
