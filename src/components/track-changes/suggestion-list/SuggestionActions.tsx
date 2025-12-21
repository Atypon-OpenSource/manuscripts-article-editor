/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { CHANGE_STATUS, RootChange } from '@manuscripts/track-changes-plugin'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../../lib/capabilities'
import { useStore } from '../../../store'
import { Accept, Reject } from './Icons'

interface Props {
  suggestions: RootChange
  handleAccept: (c: RootChange) => void
  handleReject: (c: RootChange) => void
}

const SuggestionAction: React.FC<Props> = ({
  suggestions,
  handleAccept,
  handleReject,
}) => {
  const [{ user }] = useStore((store) => ({
    user: store.user,
  }))

  const can = usePermissions()
  const suggestion = suggestions[0]

  const canRejectOwnSuggestion = useMemo(() => {
    if (
      can.handleSuggestion ||
      (can.rejectOwnSuggestion &&
        suggestion.dataTracked.status === CHANGE_STATUS.pending &&
        suggestion.dataTracked.authorID === user?._id)
    ) {
      return true
    }
    return false
  }, [suggestion, can, user?._id])

  return (
    <Actions data-cy="suggestion-actions">
      {canRejectOwnSuggestion && (
          <Action
              type="button"
              onClick={() => handleReject(suggestions)}
              aria-pressed={false}
              data-tooltip-content="Reject"
              aria-label="Reject"
          >
            <Reject color="#353535" />
          </Action>
      )}
      {can.handleSuggestion && (
          <Action
              type="button"
              onClick={() => handleAccept(suggestions)}
              aria-pressed={false}
              data-tip={true}
              data-tooltip-content="Approve"
              aria-label="Approve"
          >
            <Accept color="#353535" />
          </Action>
      )}
    </Actions>
  )
}

export default SuggestionAction

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.grid.unit * 2}px;
`

export const Action = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  width: ${(props) => props.theme.grid.unit * 7}px;
  height: ${(props) => props.theme.grid.unit * 7}px;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:not([disabled]):hover {
    &[aria-pressed='true'] {
      path {
        stroke: ${(props) => props.theme.colors.brand.medium};
      }
    }

    &[aria-pressed='false'] {
      path {
        fill: ${(props) => props.theme.colors.brand.medium};
      }
    }
    background: ${(props) => props.theme.colors.background.selected};
    border: 1px solid ${(props) => props.theme.colors.border.tracked.default};
  }

  &:focus {
    outline: none;
  }
`
