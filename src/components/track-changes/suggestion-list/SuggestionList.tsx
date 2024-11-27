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
import { GroupedChange, TrackedChange } from '@manuscripts/track-changes-plugin'
import React from 'react'
import styled from 'styled-components'

import { InspectorSection } from '../../InspectorSection'
import { Suggestion } from './Suggestion'

export interface SuggestionListProps {
  changes: GroupedChange[]
  selectionID?: string
  title: string
  type: string
  sortBy: string
  onAccept(change: TrackedChange): void
  onReject(change: TrackedChange): void
  onAcceptAll?(): void
  onSelect?(change: TrackedChange): void
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
  const changesByDate = (a: TrackedChange, b: TrackedChange) =>
    b.dataTracked.updatedAt - a.dataTracked.updatedAt

  const changesByContext = (a: TrackedChange, b: TrackedChange) =>
    a.from - b.from

  const sortedChanges = changes
    .slice()
    .sort(sortBy === 'Date' ? changesByDate : changesByContext)

  return (
    <InspectorSection
      title={title.concat(changes.length ? ` (${changes.length})` : '')}
      approveAll={onAcceptAll}
      fixed={true}
    >
      <List data-cy="suggestions-list" data-cy-type={type}>
        {sortedChanges.map((c: TrackedChange) => (
          <Suggestion
            key={c.id}
            suggestion={c}
            isSelected={selectionID === c.id}
            onAccept={() => onAccept(c)}
            onReject={() => onReject(c)}
            onSelect={() => onSelect && onSelect(c)}
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
`
