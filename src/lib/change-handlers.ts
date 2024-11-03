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
  NodeAttrChange,
  NodeChange,
  TextChange,
} from '@manuscripts/track-changes-plugin'
import { nodeNames, schema } from '@manuscripts/transform'

import { NodeTextContentRetriever } from './node-content-retriever'
import { changeOperationAlias } from './tracking'
import { getParentNode } from './utils'

interface SnippetData {
  operation: string
  nodeName: string
  content: string | null
  isEquation?: boolean
}

export const handleTextChange = (
  suggestion: TextChange,
  view: any,
  dataTracked: any
): SnippetData | null => {
  if (view) {
    const parentNodeType = getParentNode(view.state, suggestion.from)?.type
    let nodeName
    if (parentNodeType) {
      const parentNodeName = nodeNames.get(parentNodeType) || parentNodeType?.name
      nodeName =
        parentNodeType === schema.nodes.paragraph
          ? 'text'
          : parentNodeName + ' text'
    }
  
    return {
      operation: changeOperationAlias(dataTracked.operation),
      nodeName: nodeName || suggestion.nodeType.name,
      content: suggestion.text,
    }
  }
  return null
}

export const handleNodeChange = (
  suggestion: NodeChange | NodeAttrChange,
  view: any,
  doc: any,
  dataTracked: any
): SnippetData | null => {
  if (view) {
    const nodeContentRetriever = new NodeTextContentRetriever(view.state)
    const { node } = suggestion
    const operation = changeOperationAlias(dataTracked.operation)
    const nodeName = nodeNames.get(node.type) || node.type.name
  
    switch (node.type) {
      case schema.nodes.inline_footnote: {
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getInlineFootnoteContent(
            view.state,
            node.attrs
          ),
        }
      }
      case schema.nodes.footnote: {
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getFootnoteContent(view.state, node),
        }
      }
      case schema.nodes.contributor: {
        const contributorTextContent = `${node.attrs.bibliographicName.given} ${node.attrs.bibliographicName.family}`
        return {
          operation,
          nodeName,
          content: contributorTextContent,
        }
      }
      case schema.nodes.affiliation: {
        const affiliationTextContent = node.attrs.institution
        return {
          operation,
          nodeName,
          content: affiliationTextContent,
        }
      }
      case schema.nodes.citation: {
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getContentFromBibliography(
            node.attrs.id,
            node
          ),
        }
      }
      case schema.nodes.bibliography_item: {
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getContentFromBibliography(
            node.attrs.id,
            node
          ),
        }
      }
      case schema.nodes.figure_element:
      case schema.nodes.table_element:
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getFigureLabel(node),
        }
      case schema.nodes.inline_equation:
      case schema.nodes.equation_element:
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getEquationContent(node),
          isEquation: true,
        }
      case schema.nodes.section: {
        const nodeName =
          node.attrs.category === 'MPSectionCategory:subsection'
            ? 'Subsection'
            : 'Section'
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getFirstChildContent(node),
        }
      }
      case schema.nodes.list:
        return {
          operation,
          nodeName,
          content: `<span class="inspector-list-item">${nodeContentRetriever.getFirstChildContent(
            node
          )}</span>`,
        }
      default:
        return {
          operation,
          nodeName,
          content: nodeContentRetriever.getNodeTextContent(node),
        }
    }
  }
  return null
}

export const handleUnknownChange = (): SnippetData => {
  return {
    operation: '',
    nodeName: '',
    content: 'Unknown change!',
  }
}
