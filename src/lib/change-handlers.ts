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
  AffiliationAttrs,
  affiliationLabel,
  authorLabel,
  ContributorAttrs,
} from '@manuscripts/body-editor'
import {
  ChangeSet,
  NodeAttrChange,
  NodeChange,
  RootChange,
  TextChange,
} from '@manuscripts/track-changes-plugin'
import {
  ManuscriptEditorState,
  ManuscriptNode,
  nodeNames,
  schema,
} from '@manuscripts/transform'

import { NodeTextContentRetriever } from './node-content-retriever'
import { getParentNode } from './utils'

interface SnippetData {
  operation: string
  nodeName: string
  content: string | null
}

const isAltTitleNode = (node: ManuscriptNode): boolean =>
  node.type === schema.nodes.alt_title

const getTitleDisplayName = (node: ManuscriptNode): string => {
  if (isAltTitleNode(node)) {
    return (
      node.attrs.type
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' Title'
    )
  }
  return node.type.name
}

export const handleTextChange = (
  suggestion: TextChange,
  state: ManuscriptEditorState
): SnippetData | null => {
  const { dataTracked } = suggestion
  const parentNode = getParentNode(state, suggestion.from)
  let nodeName

  if (parentNode) {
    if (isAltTitleNode(parentNode)) {
      nodeName = getTitleDisplayName(parentNode)
    } else {
      const parentNodeName =
        nodeNames.get(parentNode.type) || parentNode.type?.name
      nodeName =
        parentNode.type === schema.nodes.paragraph ||
        parentNode.type === schema.nodes.text_block
          ? 'text'
          : parentNodeName + ' text'
    }
  }
  return {
    operation: changeOperationAlias(dataTracked.operation),
    nodeName: nodeName || suggestion.nodeType.name,
    content: suggestion.text,
  }
}

export const handleNodeChange = (
  suggestion: NodeChange | NodeAttrChange,
  state: ManuscriptEditorState
): SnippetData | null => {
  const nodeContentRetriever = new NodeTextContentRetriever(state)
  const { node, dataTracked } = suggestion
  const operation = changeOperationAlias(dataTracked.operation)
  const nodeName = nodeNames.get(node.type) || node.type.name

  switch (node.type) {
    case schema.nodes.inline_footnote: {
      return {
        operation,
        nodeName,
        content: nodeContentRetriever.getInlineFootnoteContent(
          state,
          node.attrs
        ),
      }
    }
    case schema.nodes.footnote: {
      return {
        operation,
        nodeName,
        content: nodeContentRetriever.getFootnoteContent(state, node),
      }
    }
    case schema.nodes.contributor: {
      return {
        operation,
        nodeName,
        content: authorLabel(node.attrs as ContributorAttrs),
      }
    }
    case schema.nodes.affiliation: {
      return {
        operation,
        nodeName,
        content: affiliationLabel(node.attrs as AffiliationAttrs),
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
    case schema.nodes.embed:
    case schema.nodes.image_element:
    case schema.nodes.hero_image:
      return {
        operation,
        nodeName,
        content: nodeContentRetriever.getFigureLabel(node),
      }

    case schema.nodes.figure: {
      const parentNode = getParentNode(state, suggestion.from)!
      const nodeName = nodeNames.get(parentNode?.type) || parentNode?.type.name
      return {
        operation,
        nodeName,
        content: nodeContentRetriever.getFigureLabel(parentNode),
      }
    }

    case schema.nodes.inline_equation:
    case schema.nodes.equation_element:
      return {
        operation,
        nodeName,
        content: nodeContentRetriever.getEquationContent(node),
      }
    case schema.nodes.section: {
      const nodeName =
        node.attrs.category === 'subsection' ? 'Subsection' : 'Section'
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
    case schema.nodes.award: {
      return {
        operation,
        nodeName: 'Funder Info',
        content: node.attrs.source,
      }
    }
    case schema.nodes.alt_title: {
      return {
        operation,
        nodeName: getTitleDisplayName(node),
        content: node.textContent,
      }
    }
    case schema.nodes.quote_image: {
      return {
        operation,
        nodeName: 'Pullquote image',
        content: node.textContent,
      }
    }
    default:
      return {
        operation,
        nodeName: nodeName.replaceAll('_', ' '),
        content: node.textContent,
      }
  }
}

export const handleGroupChanges = (
  suggestions: RootChange,
  view: any,
  doc: any,
  dataTracked: any
): SnippetData | null => {
  const processed = suggestions.map((change) => {
    const result = ChangeSet.isTextChange(change)
      ? handleTextChange(change, view.state)
      : handleNodeChange(change as NodeChange, view.state)

    const node = ChangeSet.isTextChange(change)
      ? getParentNode(view.state, change.from)
      : (change as NodeChange).node

    return {
      result,
      isTitle: node ? isAltTitleNode(node) : false,
    }
  })

  // Find the first title change if any exists
  const titleNodeName =
    processed.find(({ isTitle }) => isTitle)?.result?.nodeName || null

  // Build the content
  const content = processed
    .map(({ result }) =>
      result?.nodeName === 'inline_equation'
        ? ` ${result.content} `
        : result?.content || ''
    )
    .join('')

  return {
    operation: changeOperationAlias(dataTracked.operation),
    nodeName: titleNodeName || 'Text',
    content,
  }
}

export const handleUnknownChange = (): SnippetData => {
  return {
    operation: '',
    nodeName: '',
    content: 'Unknown change!',
  }
}

export const changeOperationAlias = (operation: string): string => {
  switch (operation) {
    case 'delete': {
      return 'Deleted'
    }
    case 'insert':
    case 'wrap_with_node': {
      return 'Inserted'
    }
    case 'set_attrs': {
      return 'Updated'
    }
    case 'node_split': {
      return 'Split'
    }
    case 'move': {
      return 'Move'
    }
    default: {
      return 'null'
    }
  }
}
