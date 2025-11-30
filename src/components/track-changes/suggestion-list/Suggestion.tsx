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
  isTabbable: boolean
}

export const Suggestion: React.FC<Props> = ({
  suggestions,
  isSelected,
  onAccept,
  onReject,
  onSelect,
  isTabbable,
}) => {
  const wrapperRef = useRef<HTMLLIElement>(null)
  const linkRef = useRef<HTMLDivElement>(null)
  const [trackModalVisible, setModalVisible] = useState(false)
  const [{ isComparingMode, isTrackingChangesVisible }] = useStore((store) => ({
    isComparingMode: store.isComparingMode,
    isTrackingChangesVisible: store.isTrackingChangesVisible,
  }))

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    if (!isTrackingChangesVisible) {
      return
    }
    setModalVisible(true)
    if (onSelect) {
      onSelect()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle horizontal navigation (Left/Right)
    // Let vertical navigation (Up/Down) bubble to parent SuggestionList
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return
    }
    if (!wrapperRef.current) {
      return
    }

    const actionButtons = Array.from(
      wrapperRef.current.querySelectorAll<HTMLButtonElement>(
        '[data-cy="suggestion-actions"] button'
      )
    )
    if (actionButtons.length === 0) {
      return
    }

    const currentElement = document.activeElement as HTMLElement

    // If on the card link and arrow right is pressed, move to first action button
    if (currentElement === linkRef.current && e.key === 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
      actionButtons[0]?.focus()
    }
    // If on an action button, navigate between them
    else if (actionButtons.includes(currentElement as HTMLButtonElement)) {
      const currentIndex = actionButtons.indexOf(
        currentElement as HTMLButtonElement
      )

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        if (currentIndex === 0) {
          linkRef.current?.focus()
        } else {
          actionButtons[currentIndex - 1]?.focus()
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        e.stopPropagation()
        if (currentIndex < actionButtons.length - 1) {
          actionButtons[currentIndex + 1]?.focus()
        }
      }
    }
  }

  useEffect(() => {
    if (isSelected && wrapperRef.current) {
      scrollIntoView(wrapperRef.current)
    }
  }, [isSelected])

  return (
    <Wrapper
      data-cy="suggestion"
      isFocused={isSelected}
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
    >
      <SuggestionSnippet
        suggestions={suggestions}
        isComparingMode={isComparingMode}
        isFocused={isSelected}
        handleAccept={onAccept}
        handleReject={onReject}
        isTrackingChangesVisible={isTrackingChangesVisible}
        linkRef={linkRef}
        isTabbable={isTabbable}
        onLinkClick={handleClick}
      />

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
