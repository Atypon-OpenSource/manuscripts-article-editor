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
import { RootChange, RootChanges } from '@manuscripts/track-changes-plugin'
import React from 'react'
import styled from 'styled-components'

import { useStore } from '../../../store'
import { InspectorSection } from '../../InspectorSection'
import { Suggestion } from './Suggestion'

export interface SuggestionListProps {
  changes: RootChanges
  selectionID?: string
  title: string
  type: string
  sortBy: string
  onAccept(change: RootChange): void | undefined
  onReject(change: RootChange): void | undefined
  onAcceptAll?(): void
  onSelect?(change: RootChange): void
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  changes,
  selectionID,
  title,
  type,
  sortBy,
  onAccept,
  onReject,
  onAcceptAll,
  onSelect,
}) => {
  const listRef = React.useRef<HTMLUListElement>(null)
  const [{ isComparingMode }] = useStore((store) => ({
    isComparingMode: store.isComparingMode,
  }))

  const changesByDate = (a: RootChange, b: RootChange) =>
    b[0].dataTracked.updatedAt - a[0].dataTracked.updatedAt

  const changesByContext = (a: RootChange, b: RootChange) =>
    a[0].from - b[0].from

  const sortedChanges = changes
    .slice()
    .sort(sortBy === 'Date' ? changesByDate : changesByContext)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!listRef.current || !['ArrowDown', 'ArrowUp'].includes(e.key)) {
      return
    }

    const suggestions = Array.from(
      listRef.current.querySelectorAll('[data-cy="suggestion"]')
    )
    if (suggestions.length === 0) {
      return
    }

    const activeElement = document.activeElement as HTMLElement
    const currentSuggestion = activeElement.closest('[data-cy="suggestion"]')
    if (!currentSuggestion) {
      return
    }

    const currentIndex = suggestions.indexOf(currentSuggestion)
    if (currentIndex === -1) {
      return
    }

    e.preventDefault()

    if (e.key === 'ArrowDown') {
      const nextIndex = (currentIndex + 1) % suggestions.length
      const nextSuggestion = suggestions[
        nextIndex
      ]?.querySelector<HTMLDivElement>('[data-cy="suggestion-card-link"]')
      nextSuggestion?.focus()
    } else if (e.key === 'ArrowUp') {
      const prevIndex =
        (currentIndex - 1 + suggestions.length) % suggestions.length
      const prevSuggestion = suggestions[
        prevIndex
      ]?.querySelector<HTMLDivElement>('[data-cy="suggestion-card-link"]')
      prevSuggestion?.focus()
    }
  }

  return (
    <InspectorSection
      title={title.concat(changes.length ? ` (${changes.length})` : '')}
      approveAll={!isComparingMode ? onAcceptAll : undefined}
      fixed={true}
    >
      <List
        ref={listRef}
        data-cy="suggestions-list"
        data-cy-type={type}
        onKeyDown={handleKeyDown}
      >
        {sortedChanges.map((c: RootChange, index: number) => (
          <Suggestion
            key={c[0].id}
            suggestions={c}
            isSelected={selectionID === c[0].id}
            onAccept={() => !isComparingMode && onAccept(c)}
            onReject={() => !isComparingMode && onReject(c)}
            onSelect={() => onSelect && onSelect(c)}
            isTabbable={index === 0}
          />
        ))}
      </List>
    </InspectorSection>
  )
}

const List = styled.ul`
  list-style: none;
  font-size: inherit;
  padding: 0;
  margin: 0;
  height: 75vh;
`
