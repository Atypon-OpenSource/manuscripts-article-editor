import { Node as ProsemirrorNode } from 'prosemirror-model'
import { iterateChildren } from '../editor/lib/utils'
import { nodeNames } from './node-names'

const getTextOfNodeType = (node: ProsemirrorNode, type: string) => {
  for (const child of iterateChildren(node)) {
    if (child.type.name === type) {
      return child.textContent
    }
  }

  return null
}

export const nodeTitle = (node: ProsemirrorNode) => {
  switch (node.type.name) {
    case 'doc':
      return getTextOfNodeType(node, 'title')

    case 'section':
      return getTextOfNodeType(node, 'section_title')

    case 'bibliography_section':
      return getTextOfNodeType(node, 'section_title')

    case 'figure':
    case 'table_figure':
      return getTextOfNodeType(node, 'figcaption')

    default:
      return node.textContent
  }
}

export const nodeTitlePlaceholder = (node: ProsemirrorNode) => {
  switch (node.type.name) {
    case 'doc':
      return 'Untitled Manuscript'

    case 'section':
      return 'Untitled Section'

    case 'bibliography_section':
      return 'Bibliography'

    default:
      return nodeNames.get(node.type.name) || ''
  }
}
