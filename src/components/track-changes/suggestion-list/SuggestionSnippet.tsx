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
import { renderMath } from '@manuscripts/body-editor'
import {
  CHANGE_STATUS,
  ChangeSet,
  NodeAttrChange,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import { schema } from '@manuscripts/transform'
import purify from 'dompurify'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { changeOperationAlias } from '../../../lib/tracking'
import {
  getAffiliationTextContent,
  getContributorTextContent,
  getEquationContent,
  getFigureLabel,
  getFootnoteText,
  getInlineFootnoteContent,
  getNodeTextContent,
  getParentNode,
  getTextContentFromBibliography,
} from '../../../lib/utils'
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
  const { dataTracked } = suggestion
  const contentRef = useRef<HTMLDivElement>(null)
  const isContainLaTeX = (text: string): boolean => {
    const latexPattern = /(\$|\\\(|\\\[|\\begin\{|\\[a-zA-Z]+(\{.*?\})?)/
    return latexPattern.test(text)
  }
  useEffect(() => {
    if (contentRef.current && snippet?.content) {
      contentRef.current.innerHTML =
        purify.sanitize(': ' + snippet.content) || ''
      if (isContainLaTeX(snippet.content)) {
        renderMath(contentRef.current)
      }
    }
  }, [snippet?.content])

  useEffect(() => {
    const getSnippetData = (): {
      snippet: SnippetData | null
    } => {
      if (ChangeSet.isTextChange(suggestion)) {
        const parentNodeName = getParentNode(view.state, suggestion.from)?.type
          .name
        return {
          snippet: {
            operation: changeOperationAlias(dataTracked.operation),
            nodeName: parentNodeName || suggestion.nodeType.name,
            content: suggestion.text,
          },
        }
      } else if (
        ChangeSet.isNodeChange(suggestion) ||
        ChangeSet.isNodeAttrChange(suggestion)
      ) {
        switch (suggestion.node.type) {
          case schema.nodes.inline_footnote:
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.spec.name,
                content: getInlineFootnoteContent(doc, suggestion.node.attrs),
              },
            }
          case schema.nodes.footnote:
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.name,
                content: getFootnoteText(view.state, suggestion.node),
              },
            }
          case schema.nodes.contributor:
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.name,
                content: getContributorTextContent(
                  suggestion.node,
                  (suggestion as NodeAttrChange).oldAttrs
                ),
              },
            }
          case schema.nodes.affiliation:
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.name,
                content: getAffiliationTextContent(
                  suggestion.node,
                  (suggestion as NodeAttrChange).oldAttrs
                ),
              },
            }
          case schema.nodes.citation:
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.name,
                content: getTextContentFromBibliography(
                  view.state,
                  suggestion.node.attrs.rids[0]
                ),
              },
            }
          case schema.nodes.bibliography_item:
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.spec.name,
                content: getTextContentFromBibliography(
                  view.state,
                  suggestion.node.attrs.id
                ),
              },
            }
          case schema.nodes.figure_element:
          case schema.nodes.table_element: {
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.spec.name,
                content: getFigureLabel(view.state, suggestion.node),
              },
            }
          }
          case schema.nodes.inline_equation:
          case schema.nodes.equation_element: {
            console.log('suggestion.node', suggestion)
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName: suggestion.node.type.spec.name,
                content: getEquationContent(suggestion.node),
              },
            }
          }
          default:
            return {
              snippet: {
                operation: changeOperationAlias(dataTracked.operation),
                nodeName:
                  suggestion.node.type.spec.name || suggestion.node.type.name,
                content: getNodeTextContent(suggestion.node),
              },
            }
        }
      }

      return {
        snippet: { operation: '', nodeName: '', content: 'Unknown change!' },
      }
    }

    const { snippet: newSnippet } = getSnippetData()
    setSnippet(newSnippet)
  }, [suggestion, doc, view.state, dataTracked.operation])

  return (
    <SnippetText isRejected={dataTracked.status === CHANGE_STATUS.rejected}>
      <>
        <Operation color={dataTracked.operation}>
          {snippet?.operation}:
        </Operation>
        <NodeName>{snippet?.nodeName}</NodeName>
        <Content ref={contentRef} />
      </>
    </SnippetText>
  )
}

const SnippetText = styled.div<{ isRejected: boolean }>`
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
`

const Content = styled.span`
  color: #353535;
  font-family: Lato, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`
