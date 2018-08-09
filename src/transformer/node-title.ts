import { Node as ProsemirrorNode } from 'prosemirror-model'
import { nodeNames } from './node-names'

const getTextOfNodeType = (node: ProsemirrorNode, type: string) => {
  let output = null

  node.forEach(node => {
    if (node.type.name === type) {
      output = node.textContent
    }
  })

  return output
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
