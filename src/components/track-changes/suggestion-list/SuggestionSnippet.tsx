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
import {
  CHANGE_OPERATION,
  ChangeSet,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import { schema } from '@manuscripts/transform'
import parse from 'html-react-parser'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  getFootnoteText,
  getInlineFootnoteContent,
} from '../../../lib/footnotes'
import { changeOperationAlias } from '../../../lib/tracking'
import { getParentNode } from '../../../lib/utils'
import { useStore } from '../../../store'

interface SnippetData {
  operation: string
  nodeName: string
  content: string
}

export const SuggestionSnippet: React.FC<{ suggestion: TrackedChange }> = ({
  suggestion,
}) => {
  const [{ doc, view }] = useStore((store) => ({
    view: store.view,
    doc: store.doc,
  }))
  const [snippet, setSnippet] = useState<SnippetData | null>(null)
  const [message, setMessage] = useState('')
  const { dataTracked } = suggestion

  useEffect(() => {
    const getSnippetData = (): {
      snippet: SnippetData | null
      message: string
    } => {
      if (ChangeSet.isTextChange(suggestion) && view) {
        const parentNode = getParentNode(view.state, suggestion.from)
        if (parentNode?.type === schema.nodes.footnote) {
          return {
            snippet: {
              operation: changeOperationAlias(dataTracked.operation),
              nodeName: parentNode.type.name || suggestion.nodeType.name,
              content: suggestion.text,
            },
            message: '',
          }
        } else {
          return { snippet: null, message: suggestion.text }
        }
      }

      if (ChangeSet.isNodeChange(suggestion) && view) {
        if (suggestion.node.type === schema.nodes.inline_footnote) {
          return {
            snippet: {
              operation: changeOperationAlias(dataTracked.operation),
              nodeName: suggestion.node.type.spec.name,
              content: getInlineFootnoteContent(doc, suggestion.attrs),
            },
            message: '',
          }
        } else if (suggestion.node.type === schema.nodes.footnote) {
          return {
            snippet: {
              operation: changeOperationAlias(dataTracked.operation),
              nodeName: suggestion.node.type.name,
              content: getFootnoteText(view.state, suggestion.node),
            },
            message: '',
          }
        } else if (
          suggestion.dataTracked.operation === CHANGE_OPERATION.node_split
        ) {
          return {
            snippet: null,
            message: `Split ${suggestion.node.type.name}`,
          }
        } else if (
          suggestion.dataTracked.operation === CHANGE_OPERATION.wrap_with_node
        ) {
          return {
            snippet: null,
            message: `${suggestion.node.type.name
              .charAt(0)
              .toUpperCase()}${suggestion.node.type.name.slice(1)} insert`,
          }
        } else {
          return {
            snippet: null,
            message: `${suggestion.node.type.name
              .charAt(0)
              .toUpperCase()}${suggestion.node.type.name.slice(1)} ${
              dataTracked.operation
            }`,
          }
        }
      }

      if (ChangeSet.isNodeAttrChange(suggestion) && view) {
        if (suggestion.node.type === schema.nodes.inline_footnote) {
          return {
            snippet: {
              operation: changeOperationAlias(dataTracked.operation),
              nodeName: suggestion.node.type.spec.name,
              content: getInlineFootnoteContent(doc, suggestion.newAttrs),
            },
            message: '',
          }
        } else if (suggestion.node.type === schema.nodes.footnote) {
          return {
            snippet: {
              operation: changeOperationAlias(dataTracked.operation),
              nodeName: suggestion.node.type.name,
              content: getFootnoteText(view.state, suggestion.node),
            },
            message: '',
          }
        } else {
          return {
            snippet: null,
            message: `${suggestion.node.type.name
              .charAt(0)
              .toUpperCase()}${suggestion.node.type.name.slice(1)} ${
              dataTracked.operation
            }`,
          }
        }
      }

      return { snippet: null, message: 'Unknown change!' }
    }

    const { snippet: newSnippet, message: newMessage } = getSnippetData()
    setSnippet(newSnippet)
    setMessage(newMessage)
  }, [suggestion, doc, view, view?.state, dataTracked.operation])

  return (
    <SnippetText>
      {snippet ? (
        <>
          <Operation color={dataTracked.operation}>
            {snippet.operation}:
          </Operation>
          <NodeName>{snippet.nodeName}:</NodeName>
          <Content>{parse(snippet.content)}</Content>
        </>
      ) : dataTracked.operation === CHANGE_OPERATION.delete ? (
        <del>{message}</del>
      ) : (
        message
      )}
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
  margin-right: 3.2px;
`

const Content = styled.span`
  color: #353535;
  font-family: Lato, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`
