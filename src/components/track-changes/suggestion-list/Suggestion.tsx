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
import { Tooltip, usePermissions } from '@manuscripts/style-guide'
import { CHANGE_STATUS, TrackedChange } from '@manuscripts/track-changes-plugin'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { useStore } from '../../../store'
import { Accept, Back, Reject } from './Icons'
import { SuggestionSnippet } from './SuggestionSnippet'

interface Props {
  suggestion: TrackedChange
  handleAccept: (c: TrackedChange) => void
  handleReject: (c: TrackedChange) => void
  handleReset: (c: TrackedChange) => void
  handleClickSuggestion(c: TrackedChange): void
}

export const Suggestion: React.FC<Props> = ({
  suggestion,
  handleAccept,
  handleReject,
  handleReset,
  handleClickSuggestion,
}) => {
  const [{ user, selectedSuggestion }] = useStore((store) => ({
    user: store.user,
    selectedSuggestion: store.selectedSuggestion,
  }))

  const can = usePermissions()

  const wrapperRef = useRef<HTMLLIElement>(null)

  const [suggestionClicked, setSuggestionClicked] = useState(false)

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

  const isRejected = useMemo(() => {
    return suggestion.dataTracked.status === CHANGE_STATUS.rejected
  }, [suggestion])

  const isAccepted = useMemo(() => {
    return suggestion.dataTracked.status === CHANGE_STATUS.accepted
  }, [suggestion])

  const isSelectedSuggestion = useMemo(() => {
    return !!(selectedSuggestion && selectedSuggestion === suggestion.id)
  }, [selectedSuggestion, suggestion])

  useEffect(() => {
    if (isSelectedSuggestion && wrapperRef.current && !suggestionClicked) {
      const wrapperRefElement = wrapperRef.current
      wrapperRefElement.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'start',
      })
    }
    setSuggestionClicked(false)
  }, [isSelectedSuggestion]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Wrapper
      data-cy="suggestion"
      isFocused={isSelectedSuggestion}
      ref={wrapperRef}
    >
      <FocusHandle
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setSuggestionClicked(true)
          handleClickSuggestion(suggestion)
        }}
        isDisabled={isRejected}
      >
        <SuggestionSnippet suggestion={suggestion} />
      </FocusHandle>

      <Actions data-cy="suggestion-actions">
        <>
          {canRejectOwnSuggestion && (
            <Container>
              <Action
                type="button"
                onClick={() =>
                  isRejected
                    ? handleReset(suggestion)
                    : handleReject(suggestion)
                }
                aria-pressed={isRejected}
                data-tooltip-id={isRejected ? 'back-tooltip' : 'reject-tooltip'}
              >
                {isRejected ? (
                  <Back color="#353535" />
                ) : (
                  <Reject color="#353535" />
                )}
              </Action>
              {isRejected ? (
                <Tooltip id="back-tooltip" place="bottom">
                  Back to suggestions
                </Tooltip>
              ) : (
                <Tooltip id="reject-tooltip" place="bottom">
                  Reject
                </Tooltip>
              )}
            </Container>
          )}
          {can.handleSuggestion && (
            <Container>
              <Action
                type="button"
                onClick={() =>
                  isAccepted
                    ? handleReset(suggestion)
                    : handleAccept(suggestion)
                }
                aria-pressed={isAccepted}
                data-tip={true}
                data-for={isAccepted ? 'back-tooltip' : 'approve-tooltip'}
              >
                {isAccepted ? (
                  <Back color="#353535" />
                ) : (
                  <Accept color="#353535" />
                )}
              </Action>
              {isAccepted ? (
                <Tooltip id="back-tooltip" place="bottom">
                  Back to suggestions
                </Tooltip>
              ) : (
                <Tooltip id="approve-tooltip" place="bottom">
                  Approve
                </Tooltip>
              )}
            </Container>
          )}
        </>
      </Actions>
    </Wrapper>
  )
}

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.grid.unit * 2}px;
  visibility: hidden;
`

const Wrapper = styled.li<{
  isFocused: boolean
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${(props) => props.theme.grid.unit * 4}px;
  padding: ${(props) => props.theme.grid.unit * 1.5}px
    ${(props) => props.theme.grid.unit * 2}px !important;
  min-height: 28px;
  margin-bottom: 6px;
  border: ${(props) =>
    props.isFocused
      ? `1px solid ${props.theme.colors.border.tracked.active}`
      : `1px solid ${props.theme.colors.border.tracked.default}`};
  box-shadow: ${(props) =>
    props.isFocused
      ? `-4px 0 0 0  ${props.theme.colors.border.tracked.active}`
      : `none`};
  list-style-type: none;
  font-size: ${(props) => props.theme.font.size.small};

  /* FocusHandle should cover entire card: */
  position: relative;
  color: ${(props) => props.theme.colors.text.primary};
  background: ${(props) =>
    props.isFocused
      ? props.theme.colors.background.tracked.active + ' !important'
      : props.theme.colors.background.tracked.default};

  ${(props) =>
    props.isFocused
      ? `${Actions} {
        visibility: visible;
      }`
      : ''}

  &:hover {
    background: ${(props) => props.theme.colors.background.tracked.hover};

    ${Actions} {
      visibility: visible;
    }
  }
`

const FocusHandle = styled.a<{
  isDisabled: boolean
}>`
  display: flex;
  gap: ${(props) => props.theme.grid.unit * 1}px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: inherit;
  text-decoration: none;
  pointer-events: ${(props) => (props.isDisabled ? 'none' : 'all')};
  overflow: hidden;
`

const Action = styled.button`
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

const Container = styled.div`
  .tooltip {
    border-radius: ${(props) => props.theme.grid.unit * 1.5}px;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    max-width: ${(props) => props.theme.grid.unit * 15}px;
    font-size: ${(props) => props.theme.font.size.small};
  }
`
