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
import { ChangeSet, TrackedChange } from '@manuscripts/track-changes-plugin'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  handleNodeChange,
  handleTextChange,
  handleUnknownChange,
} from '../../../lib/change-handlers'
import { useStore } from '../../../store'
import SnippetContent from './SnippetContent'

interface SnippetData {
  operation: string
  nodeName: string
  content: string | null
}

export const SuggestionSnippet: React.FC<{ suggestion: TrackedChange }> = ({
  suggestion,
}) => {
  const [{ doc, view }] = useStore((store) => ({
    view: store.view,
    doc: store.doc,
  }))
  const [snippet, setSnippet] = useState<SnippetData | null>(null)
  const { dataTracked } = suggestion

  useEffect(() => {
    let newSnippet: SnippetData | null = null
    if (view) {
      if (ChangeSet.isTextChange(suggestion)) {
        newSnippet = handleTextChange(suggestion, view.state)
      } else if (
        ChangeSet.isNodeChange(suggestion) ||
        ChangeSet.isNodeAttrChange(suggestion)
      ) {
        console.log('suggestion', suggestion)
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
      <>
        <Operation color={dataTracked.operation}>
          {snippet?.operation}:
        </Operation>
        <NodeName>{snippet?.nodeName}</NodeName>
        <SnippetContent content={snippet?.content || ''} />
      </>
    </SnippetText>
  )
}

const SnippetText = styled.div`
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  color: ${(props) => props.theme.colors.text.primary};
  display: block;
  text-overflow: ellipsis;
  &[data-mathjax='true'] {
    text-overflow: unset;
  }
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
