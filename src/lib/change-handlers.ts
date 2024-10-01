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
import { schema } from '@manuscripts/transform'

import { NodeTextContentRetriever } from './node-content-retriever'
import { changeOperationAlias } from './tracking'
import { getParentNode } from './utils'

interface SnippetData {
  operation: string
  nodeName: string
  content: string
  isEquation?: boolean
}

export const handleTextChange = (
  suggestion: TextChange,
  view: any,
  dataTracked: any
): SnippetData | null => {
  const parentNodeType = getParentNode(view.state, suggestion.from)?.type
  const parentNodeName = parentNodeType?.spec.name || parentNodeType?.name
  const nodeName =
    parentNodeType === schema.nodes.paragraph
      ? 'text'
      : parentNodeName + ' text'

  return {
    operation: changeOperationAlias(dataTracked.operation),
    nodeName: nodeName || suggestion.nodeType.name,
    content: suggestion.text,
  }
}

export const handleNodeChange = (
  suggestion: NodeChange | NodeAttrChange,
  view: any,
  doc: any,
  dataTracked: any
): SnippetData | null => {
  const nodeContentRetriever = new NodeTextContentRetriever(view.state)
  const { node } = suggestion
  const operation = changeOperationAlias(dataTracked.operation)
  const nodeName = node.type.spec.name || node.type.name

  switch (suggestion.node.type) {
    case schema.nodes.inline_footnote: {
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getInlineFootnoteContent(
          doc,
          suggestion.node.attrs
        ),
      }
    }
    case schema.nodes.footnote: {
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getFootnoteContent(suggestion.node),
      }
    }
    case schema.nodes.contributor: {
      const contributorTextContent = `${suggestion.node.attrs.bibliographicName.given} ${suggestion.node.attrs.bibliographicName.family}`
      return {
        operation: operation,
        nodeName: nodeName,
        content: contributorTextContent,
      }
    }
    case schema.nodes.affiliation: {
      const affiliationTextContent = suggestion.node.attrs.institution
      return {
        operation: operation,
        nodeName: nodeName,
        content: affiliationTextContent,
      }
    }
    case schema.nodes.citation: {
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getContentFromBibliography(
          suggestion.node.attrs.id,
          suggestion.node.type
        ),
      }
    }
    case schema.nodes.bibliography_item: {
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getContentFromBibliography(
          suggestion.node.attrs.id,
          suggestion.node.type
        ),
      }
    }
    case schema.nodes.figure_element:
    case schema.nodes.table_element:
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getFigureLabel(suggestion.node),
      }
    case schema.nodes.inline_equation:
    case schema.nodes.equation_element:
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getEquationContent(suggestion.node),
        isEquation: true,
      }
    case schema.nodes.section: {
      const nodeName =
        suggestion.node.attrs.category === 'MPSectionCategory:subsection'
          ? 'Subsection'
          : 'Section'
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getFirstChildContent(suggestion.node),
      }
    }
    case schema.nodes.list:
      return {
        operation: operation,
        nodeName: nodeName,
        content: `<span class="inspector-list-item">${nodeContentRetriever.getFirstChildContent(
          suggestion.node
        )}</span>`,
      }
    default:
      return {
        operation: operation,
        nodeName: nodeName,
        content: nodeContentRetriever.getNodeTextContent(suggestion.node),
      }
  }
}

export const handleUnknownChange = (): SnippetData => {
  return {
    operation: '',
    nodeName: '',
    content: 'Unknown change!',
  }
}
