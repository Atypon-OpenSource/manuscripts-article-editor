import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Nodes } from '../editor/config/schema/nodes'
import { iterateChildren } from '../editor/lib/utils'
import { nodeNames } from './node-names'

const getTextOfNodeType = (node: ProsemirrorNode, type: Nodes) => {
  for (const child of iterateChildren(node)) {
    if (child.type.name === type) {
      return child.textContent
    }
  }

  return null
}

export const nodeTitle = (node: ProsemirrorNode) => {
  switch (node.type.name as Nodes) {
    case 'section':
      return getTextOfNodeType(node, 'section_title')

    case 'bibliography_section':
      return getTextOfNodeType(node, 'section_title')

    case 'figure_element':
    case 'table_element':
    case 'equation_element':
    case 'listing_element':
      return getTextOfNodeType(node, 'figcaption')

    default:
      return node.textContent
  }
}

export const nodeTitlePlaceholder = (type: string) => {
  switch (type) {
    case 'doc':
      return 'Untitled Manuscript'

    case 'section':
      return 'Untitled Section'

    case 'bibliography_section':
      return 'Bibliography'

    default:
      return nodeNames.get(type) || ''
  }
}
