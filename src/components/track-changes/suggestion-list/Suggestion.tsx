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

import { TrackedChange } from '@manuscripts/track-changes-plugin'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import TrackModal from '../TrackModal'
import SuggestionActions from './SuggestionActions'
import { SuggestionSnippet } from './SuggestionSnippet'

const scrollIntoView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  if (rect.bottom > window.innerHeight || rect.top < 150) {
    element.scrollIntoView()
  }
}

interface Props {
  suggestion: TrackedChange
  isSelected: boolean
  onAccept: () => void
  onReject: () => void
  onReset: () => void
  onSelect(): void
}

export const Suggestion: React.FC<Props> = ({
  suggestion,
  isSelected,
  onAccept,
  onReject,
  onReset,
  onSelect,
}) => {
  const wrapperRef = useRef<HTMLLIElement>(null)
  const [trackModalVisible, setModalVisible] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setModalVisible(true)
    if (onSelect) {
      onSelect()
    }
  }

  useEffect(() => {
    if (isSelected && wrapperRef.current) {
      scrollIntoView(wrapperRef.current)
    }
  }, [isSelected])

  return (
    <Wrapper data-cy="suggestion" isFocused={isSelected} ref={wrapperRef}>
      <FocusHandle href="#" onClick={handleClick}>
        <SuggestionSnippet suggestion={suggestion} />
      </FocusHandle>

      <Actions>
        <SuggestionActions
          suggestion={suggestion}
          handleAccept={onAccept}
          handleReject={onReject}
          handleReset={onReset}
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
