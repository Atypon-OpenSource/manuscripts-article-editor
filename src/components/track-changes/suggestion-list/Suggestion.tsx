/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import { RootChange } from '@manuscripts/track-changes-plugin'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { scrollIntoView } from '../../../lib/utils'
import { useStore } from '../../../store'
import TrackModal from '../TrackModal'
import { SuggestionSnippet } from './SuggestionSnippet'

interface Props {
  suggestions: RootChange
  isSelected: boolean
  onAccept: () => void
  onReject: () => void
  onSelect(): void
}

export const Suggestion: React.FC<Props> = ({
  suggestions,
  isSelected,
  onAccept,
  onReject,
  onSelect,
}) => {
  const wrapperRef = useRef<HTMLLIElement>(null)
  const [trackModalVisible, setModalVisible] = useState(false)
  const [{ isComparingMode, isTrackingChangesVisible }] = useStore((store) => ({
    isComparingMode: store.isComparingMode,
    isTrackingChangesVisible: store.isTrackingChangesVisible,
  }))

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isTrackingChangesVisible) {
      return
    }
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
      <FocusHandle
        isTrackingChangesVisible={isTrackingChangesVisible}
        href="#"
        onClick={handleClick}
      >
        <SuggestionSnippet
          suggestions={suggestions}
          isComparingMode={isComparingMode}
          isFocused={isSelected}
          handleAccept={onAccept}
          handleReject={onReject}
        />
      </FocusHandle>

      {trackModalVisible && (
        <TrackModal
          ref={wrapperRef}
          isVisible={trackModalVisible}
          changeId={suggestions[0].id}
          setVisible={setModalVisible}
        ></TrackModal>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.li<{
  isFocused: boolean
}>``

const FocusHandle = styled.a<{
  isTrackingChangesVisible: boolean
}>`
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  cursor: ${(props) =>
    props.isTrackingChangesVisible ? 'pointer' : 'default'};
`
