/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import { AvatarIcon, RelativeDate } from '@manuscripts/style-guide'
import { ChangeSet, RootChange } from '@manuscripts/track-changes-plugin'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  handleGroupChanges,
  handleMarkChange,
  handleNodeChange,
  handleTextChange,
  handleUnknownChange,
} from '../../../lib/change-handlers'
import { useStore } from '../../../store'
import SnippetContent from './SnippetContent'
import SuggestionActions from './SuggestionActions'

interface SnippetData {
  operation: string
  nodeName: string
  content: string | null
}

interface Props {
  suggestions: RootChange
  isComparingMode: boolean | undefined
  isFocused: boolean
  handleAccept: (c: RootChange) => void
  handleReject: (c: RootChange) => void
}

export const SuggestionSnippet: React.FC<Props> = ({
  suggestions,
  isComparingMode,
  isFocused,
  handleAccept,
  handleReject,
}) => {
  const [{ doc, view, collaboratorsById }] = useStore((store) => ({
    view: store.view,
    doc: store.doc,
    collaboratorsById: store.collaboratorsById,
  }))
  const [snippet, setSnippet] = useState<SnippetData | null>(null)
  const suggestion = suggestions[0]
  const { dataTracked } = suggestion

  const author = collaboratorsById.get(dataTracked?.authorID)
  const name = author?.bibliographicName
  const authorName =
    name && (name.given || name.family)
      ? name.family
        ? `${name.given ? name.given[0] + '.' : ''} ${name.family}`
        : name.given
      : ''

  useEffect(() => {
    let newSnippet: SnippetData | null = null
    if (view) {
      if (suggestions.length > 1) {
        newSnippet = handleGroupChanges(suggestions, view, doc, dataTracked)
      } else if (ChangeSet.isTextChange(suggestion)) {
        newSnippet = handleTextChange(suggestion, view.state)
      } else if (ChangeSet.isMarkChange(suggestion)) {
        newSnippet = handleMarkChange(suggestion, view.state)
      } else if (
        ChangeSet.isNodeChange(suggestion) ||
        ChangeSet.isNodeAttrChange(suggestion)
      ) {
        newSnippet = handleNodeChange(suggestion, view.state)
      } else {
        newSnippet = handleUnknownChange()
      }

      setSnippet(newSnippet)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestion, doc, view])

  return (
    <SnippetText>
      <Card isFocused={isFocused} data-cy="suggestion-card">
        <CardHeader data-cy="card-header">
          <CardMetadata data-cy="card-metadata">
            <AuthorContainer>
              <AvatarIcon width={16} height={16} />
              <AuthorName>{authorName}</AuthorName>{' '}
            </AuthorContainer>
            <MetadataDate date={dataTracked?.createdAt} />
          </CardMetadata>
          {!isComparingMode && (
            <CardActions>
              <SuggestionActions
                suggestions={suggestions}
                handleAccept={handleAccept}
                handleReject={handleReject}
              />
            </CardActions>
          )}
        </CardHeader>
        <CardBody data-cy="card-body">
          {snippet?.operation && (
            <Operation color={dataTracked.operation}>
              {snippet?.operation}:
            </Operation>
          )}
          {snippet?.nodeName && <NodeName>{snippet?.nodeName}</NodeName>}
          <SnippetContent content={snippet?.content || ''} />
        </CardBody>
      </Card>
    </SnippetText>
  )
}

const CardActions = styled.div`
  visibility: hidden;
`

export const Card = styled.div<{
  isFocused: boolean
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${(props) => props.theme.grid.unit}px;
  padding: 8px;
  margin-bottom: 6px;
  border: ${(props) =>
    props.isFocused
      ? `1px solid ${props.theme.colors.border.tracked.active}`
      : `1px solid ${props.theme.colors.border.tracked.default}`};
  box-shadow: ${(props) =>
    props.isFocused
      ? `-4px 0 0 0  ${props.theme.colors.border.tracked.active}`
      : `none`};
  border-radius: 4px;

  /* FocusHandle should cover entire card: */
  position: relative;
  color: ${(props) => props.theme.colors.text.primary};
  background: ${(props) =>
    props.isFocused
      ? props.theme.colors.background.tracked.active + ' !important'
      : props.theme.colors.background.tracked.default};

  ${(props) =>
    props.isFocused
      ? `${CardActions} {
        visibility: visible;
      }`
      : ''}

  &:hover {
    background: ${(props) => props.theme.colors.background.tracked.hover};

    ${CardActions} {
      visibility: visible;
    }
  }
`
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 24px;
  width: 100%;
`
export const CardBody = styled.div`
  position: relative;
  display: block;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  &[data-mathjax='true'] {
    text-overflow: unset;
  }
`

export const CardMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
export const AuthorName = styled.span`
  font-family: Lato, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
`
const MetadataDate = styled(RelativeDate)`
  color: ${(props) => props.theme.colors.text.secondary};
`

const SnippetText = styled.div`
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  width: 100%;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text.primary};
  display: block;
`

const Operation = styled.span<{ color: string }>`
  font-family: Lato, sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
  line-height: 16px;
  margin-right: 3.2px;
  color: ${(props) => {
    switch (props.color) {
      case 'insert':
      case 'wrap_with_node':
        return '#01872E'
      case 'delete':
        return '#F35143'
      case 'node_split':
      case 'move':
      case 'set_attrs':
        return '#0284B0'
      default:
        return '#353535'
    }
  }};
`

const NodeName = styled.span`
  text-transform: capitalize;
  color: #353535;
  font-family: Lato, sans-serif;
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
`
