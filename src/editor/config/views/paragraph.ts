import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class Paragraph extends Block {
  protected get elementType() {
    return 'p'
  }
}

const paragraph = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos,
  decorations
) => {
  // TODO: set a node property instead?
  for (const decoration of decorations) {
    if (decoration.spec.element) {
      return new Paragraph(props, node, view, getPos)
    }
  }

  const dom = document.createElement('p')
  dom.id = node.attrs.id

  return {
    dom,
    contentDOM: dom,
  }
}

export default paragraph
