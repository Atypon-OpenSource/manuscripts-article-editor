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

import { CHANGE_STATUS, TrackedChange } from '@manuscripts/track-changes-plugin'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { useStore } from '../../../store'
import TrackModal from '../TrackModal'
import SuggestionActions from './SuggestionActions'
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
  const [{ selectedSuggestion }] = useStore((store) => ({
    user: store.user,
    selectedSuggestion: store.selectedSuggestion,
  }))

  const wrapperRef = useRef<HTMLLIElement>(null)

  const [suggestionClicked, setSuggestionClicked] = useState(false)

  const isSelectedSuggestion = useMemo(() => {
    return !!(selectedSuggestion && selectedSuggestion === suggestion.id)
  }, [selectedSuggestion, suggestion])

  const [trackModalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (isSelectedSuggestion && wrapperRef.current) {
      setModalVisible(true)
      if (!suggestionClicked) {
        const wrapperRefElement = wrapperRef.current
        wrapperRefElement.scrollIntoView({
          behavior: 'auto',
          block: 'start',
          inline: 'start',
        })
      }
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
          if (suggestion.dataTracked.status !== CHANGE_STATUS.rejected) {
            setSuggestionClicked(true)
            handleClickSuggestion(suggestion)
          }
          setModalVisible(true)
        }}
      >
        <SuggestionSnippet suggestion={suggestion} />
      </FocusHandle>

      <Actions>
        <SuggestionActions
          suggestion={suggestion}
          handleAccept={handleAccept}
          handleReject={handleReject}
          handleReset={handleReset}
        />
      </Actions>

      {trackModalVisible && (
        <TrackModal
          ref={wrapperRef}
          isVisible={trackModalVisible}
          changeId={suggestion.id}
          setVisible={setModalVisible}
        ></TrackModal>
      )}
    </Wrapper>
  )
}

const Actions = styled.div`
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

const FocusHandle = styled.a`
  display: flex;
  gap: ${(props) => props.theme.grid.unit * 1}px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: inherit;
  text-decoration: none;
  overflow: hidden;
`
