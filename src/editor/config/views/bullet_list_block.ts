import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class BulletListBlock extends Block {
  protected get elementType() {
    return 'ul'
  }

  protected get objectName() {
    return 'List'
  }
}

const bulletListBlock = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos,
  decorations
) => {
  for (const decoration of decorations) {
    if (decoration.spec.element) {
      return new BulletListBlock(props, node, view, getPos)
    }
  }

  const dom = document.createElement('ul')
  dom.id = node.attrs.id

  return {
    dom,
    contentDOM: dom,
  }
}

export default bulletListBlock
