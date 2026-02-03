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
  FileAttachment,
} from '@manuscripts/body-editor'
import {
  CHANGE_OPERATION,
  ChangeSet,
  MarkChange,
  NodeAttrChange,
  NodeChange,
  NodeMoveAttrs,
  RootChange,
  TextChange,
  TrackedAttrs,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptNode,
  nodeNames,
  schema,
} from '@manuscripts/transform'
import { escape } from 'lodash'
import { findChildrenByType } from 'prosemirror-utils'

import { NodeTextContentRetriever } from './node-content-retriever'
import { getParentNode } from './utils'
import { getTransAbstractDisplayName } from './trans-abstract'

interface SnippetData {
  operation: string
  nodeName: string
  content: string | null
}

// Check if this is an indentation operation
const isIndentation = (dataTracked: TrackedAttrs): boolean => {
  return (
    dataTracked.operation === 'move' &&
    !!(dataTracked as NodeMoveAttrs).indentationType
  )
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

// Handle indentation changes
const handleIndentationChange = (
  dataTracked: NodeMoveAttrs,
  operation: string,
  doc: ManuscriptNode
): SnippetData => {
  if (!dataTracked.moveNodeId) {
    return { operation, nodeName: '', content: '' }
  }

  let foundNode: ManuscriptNode | null = null
  doc.descendants((n: ManuscriptNode) => {
    if (foundNode) {
      return false
    }
    const tracked = n.attrs?.dataTracked as TrackedAttrs[] | null
    if (
      Array.isArray(tracked) &&
      tracked.some(
        (t) =>
          t.operation === 'delete' && t.moveNodeId === dataTracked.moveNodeId
      )
    ) {
      foundNode = n
    }
  })

  if (!foundNode) {
    return { operation, nodeName: '', content: '' }
  }

  const nodeType = foundNode ? (foundNode as ManuscriptNode).type : null
  const nodeName = nodeType ? nodeType.name : ''
  let content = ''

  // Get content
  if (nodeType === schema.nodes.section) {
    const title = findChildrenByType(
      foundNode as ManuscriptNode,
      schema.nodes.section_title
    )[0]
    content = (title.node as ManuscriptNode).textContent || ''
  } else if (nodeType === schema.nodes.paragraph) {
    content = (foundNode as ManuscriptNode).textContent || ''
  }

  return { operation, nodeName, content }
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
    operation: changeOperationAlias(dataTracked),
    nodeName: nodeName || suggestion.nodeType.name,
    content: escape(suggestion.text),
  }
}

export const handleMarkChange = (
  suggestion: MarkChange,
  _: ManuscriptEditorState
) => {
  const { dataTracked } = suggestion
  return {
    operation: changeOperationAlias(dataTracked),
    nodeName: suggestion.mark.type.name,
    content: escape(suggestion.node.text),
  }
}

export const handleNodeChange = (
  suggestion: NodeChange | NodeAttrChange,
  state: ManuscriptEditorState,
  files?: FileAttachment[]
): SnippetData | null => {
  const nodeContentRetriever = new NodeTextContentRetriever(state)
  const { node, dataTracked } = suggestion
  const operation = changeOperationAlias(dataTracked)
  const nodeName = nodeNames.get(node.type) || node.type.name
  const parentNode = getParentNode(state, suggestion.from)!

  if (dataTracked.operation === CHANGE_OPERATION.structure) {
    return {
      operation,
      nodeName,
      content: nodeContentRetriever.getFirstChildContent(node) + ' ',
    }
  }
  // Early return for indentation changes
  if (isIndentation(dataTracked)) {
    return handleIndentationChange(
      dataTracked as NodeMoveAttrs,
      operation,
      state.doc
    )
  }

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
    case schema.nodes.figcaption: {
      return {
        operation,
        nodeName:
          parentNode?.type === schema.nodes.box_element
            ? 'label'
            : 'figcaption',

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

    case schema.nodes.trans_abstract: {
      const nodeName = getTransAbstractDisplayName(node)
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
    case schema.nodes.supplement: {
      const file = files?.find((f) => f.id === node.attrs.href)
      return {
        operation,
        nodeName,
        content: file ? file.name : '',
      }
    }
    case schema.nodes.supplements: {
      return {
        operation,
        nodeName,
        content: '',
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
    case schema.nodes.subtitles: {
      return {
        operation,
        nodeName: 'Subtitle',
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

export const buildSnippet = (
  suggestions: RootChange,
  view: ManuscriptEditorView,
  dataTracked: any,
  files?: FileAttachment[]
) => {
  let content = ''
  let title = ''
  let titleNodeName = ''
  suggestions.forEach((change: TrackedChange) => {
    let result: SnippetData | null = null
    let node: ManuscriptNode | null = null

    if (ChangeSet.isNodeChange(change) || ChangeSet.isNodeAttrChange(change)) {
      result = handleNodeChange(change, view.state, files)
      node = change.node
    } else if (ChangeSet.isTextChange(change)) {
      result = handleTextChange(change, view.state)
      node = getParentNode(view.state, change.from)
    } else if (ChangeSet.isMarkChange(change)) {
      result = handleMarkChange(change, view.state)
    } else {
      handleUnknownChange()
    }

    titleNodeName =
      result && node && isAltTitleNode(node) ? result.nodeName : ''

    content +=
      result?.nodeName === schema.nodes.inline_equation.name
        ? ` ${result.content} `
        : result?.content || ''

    if (result?.nodeName) {
      title = result.nodeName
    }

    // Find the first title change if any exists and use its nodeName for the change name
    if (titleNodeName) {
      title = titleNodeName
    }

    return {
      result,
    }
  })

  return {
    operation: changeOperationAlias(dataTracked),
    nodeName: title || 'Text',
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

export const changeOperationAlias = (dataTracked: TrackedAttrs): string => {
  const { operation } = dataTracked
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
    case 'structure': {
      return 'Convert To'
    }
    case 'node_split': {
      return 'Split'
    }
    case 'move': {
      // Check for indentation
      const indentationType = dataTracked.indentationType
      if (indentationType) {
        return indentationType === 'indent' ? 'Indented' : 'Unindented'
      }
      return 'Move'
    }
    default: {
      return 'null'
    }
  }
}
