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
import { RootChange } from '@manuscripts/track-changes-plugin'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { buildSnippet } from '../../../lib/change-handlers'
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
  isTrackingChangesVisible: boolean
  linkRef: (el: HTMLDivElement | null) => void
  isTabbable: boolean
  onLinkClick: (e: React.MouseEvent | React.KeyboardEvent) => void
  actionButtonRefs?: (el: HTMLButtonElement | null, index: number) => void
}

export const SuggestionSnippet: React.FC<Props> = ({
  suggestions,
  isComparingMode,
  isFocused,
  handleAccept,
  handleReject,
  isTrackingChangesVisible: isTrackingChangesVisibleProp,
  linkRef,
  isTabbable,
  onLinkClick,
  actionButtonRefs,
}) => {
  const [{ view, collaboratorsById, files, isTrackingChangesVisible }] =
    useStore((store) => ({
      view: store.view,
      doc: store.doc,
      collaboratorsById: store.collaboratorsById,
      files: store.files,
      isTrackingChangesVisible: store.isTrackingChangesVisible,
    }))
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

  const snippet: SnippetData | null = useMemo(() => {
    let newSnippet: SnippetData | null = null
    if (view) {
      newSnippet = buildSnippet(suggestions, view, dataTracked, files)
    }
    return newSnippet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestion, view, files])

  return (
    <SnippetText>
      <CardLink
        ref={linkRef}
        data-cy="suggestion-card-link"
        onClick={onLinkClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.target !== e.currentTarget) {
            return
          }
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onLinkClick(e)
          }
        }}
        tabIndex={isTabbable ? 0 : -1}
        isTrackingChangesVisible={isTrackingChangesVisibleProp}
        role="button"
      >
        <Card
          isFocused={isFocused}
          isTrackingChangesVisible={isTrackingChangesVisible}
          data-cy="suggestion-card"
        >
          <CardHeader data-cy="card-header">
            <CardMetadata data-cy="card-metadata">
              <AuthorContainer>
                <AvatarIcon width={16} height={16} />
                <AuthorName>{authorName}</AuthorName>{' '}
              </AuthorContainer>
              <MetadataDate
                date={dataTracked?.createdAt}
                isTrackingChangesVisible={isTrackingChangesVisible}
              />
            </CardMetadata>
            {!isComparingMode && (
              <CardActions data-cy="card-actions">
                <SuggestionActions
                  suggestions={suggestions}
                  handleAccept={handleAccept}
                  handleReject={handleReject}
                  buttonRefs={actionButtonRefs}
                />
              </CardActions>
            )}
          </CardHeader>
          <CardBody data-cy="card-body">
            {snippet?.operation && (
              <Operation
                color={
                  isTrackingChangesVisible ? dataTracked.operation : 'muted'
                }
              >
                {snippet?.operation}:
              </Operation>
            )}
            {snippet?.nodeName && <NodeName>{snippet?.nodeName}</NodeName>}
            <SnippetContent content={snippet?.content || ''} />
          </CardBody>
        </Card>
      </CardLink>
    </SnippetText>
  )
}

const CardActions = styled.div`
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
`

const CardLink = styled.div<{
  isTrackingChangesVisible: boolean
}>`
  color: inherit;
  overflow: hidden;
  cursor: ${(props) =>
    props.isTrackingChangesVisible ? 'pointer' : 'default'};
  display: block;

  &:focus {
    outline: none;
  }

  ${(props) =>
    props.isTrackingChangesVisible
      ? `&:focus > div,
      &:focus-within > div {
      background: ${props.theme.colors.background.tracked.hover};
      
      & ${CardActions} {
        opacity: 1;
        pointer-events: auto;
      }
    }`
      : ''}
`

const isActive = (props: {
  isFocused: boolean
  isTrackingChangesVisible: boolean
}) => props.isFocused && props.isTrackingChangesVisible

export const Card = styled.div<{
  isFocused: boolean
  isTrackingChangesVisible: boolean
}>`
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${(props) => props.theme.grid.unit}px;
  padding: 8px;
  margin-bottom: 6px;
  border: ${(props) =>
    isActive(props)
      ? `1px solid ${props.theme.colors.border.tracked.active}`
      : props.isTrackingChangesVisible
        ? `1px solid ${props.theme.colors.border.tracked.default}`
        : `1px solid #dfdfdf`};
  box-shadow: ${(props) =>
    isActive(props)
      ? `-4px 0 0 0  ${props.theme.colors.border.tracked.active}`
      : `none`};
  border-radius: 4px;

  /* FocusHandle should cover entire card: */
  position: relative;
  color: ${(props) =>
    props.isTrackingChangesVisible
      ? props.theme.colors.text.primary
      : '#868686'};
  background: ${(props) =>
    isActive(props)
      ? props.theme.colors.background.tracked.active + ' !important'
      : props.theme.colors.background.tracked.default};

  ${(props) =>
    isActive(props)
      ? `${CardActions} {
        opacity: 1;
        pointer-events: auto;
      }`
      : ''}
  ${(props) =>
    props.isTrackingChangesVisible
      ? `&:hover {
      background: ${props.theme.colors.background.tracked.hover};

      ${CardActions} {
        opacity: 1;
        pointer-events: auto;
      }
    }`
      : ''}
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
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: 700;
  line-height: 24px;
`
const MetadataDate = styled(RelativeDate)<{
  isTrackingChangesVisible: boolean
}>`
  color: ${(props) =>
    props.isTrackingChangesVisible
      ? props.theme.colors.text.secondary
      : '#868686'};
`

const SnippetText = styled.div`
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  width: 100%;
  white-space: nowrap;
  display: block;
`

const Operation = styled.span<{ color: string }>`
  font-weight: ${(props) => props.theme.font.weight.bold};
  text-transform: capitalize;
  margin-right: 3.2px;
  color: ${(props) => {
    switch (props.color) {
      case 'insert':
      case 'wrap_with_node':
        return '#01872E'
      case 'delete':
        return '#F35143'
      case 'structure':
      case 'node_split':
      case 'move':
      case 'set_attrs':
        return '#0284B0'
      case 'muted':
        return '#868686'
      default:
        return '#353535'
    }
  }};
`

const NodeName = styled.span`
  text-transform: capitalize;
  font-weight: ${(props) => props.theme.font.weight.bold};
  // line-height: 16px;
`
