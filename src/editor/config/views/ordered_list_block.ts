import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class OrderedListBlock extends Block {
  protected get elementType() {
    return 'ol'
  }

  protected get objectName() {
    return 'List'
  }
}

const orderedListBlock = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos,
  decorations
) => {
  for (const decoration of decorations) {
    if (decoration.spec.element) {
      return new OrderedListBlock(props, node, view, getPos)
    }
  }

  const dom = document.createElement('ol')
  dom.id = node.attrs.id

  if (node.attrs.order !== 1) {
    dom.setAttribute('start', node.attrs.order)
  }

  return {
    dom,
    contentDOM: dom,
  }
}

export default orderedListBlock
