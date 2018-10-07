import { EditorProps } from '../../Editor'
import { sectionLevel } from '../../lib/menu'
import { NodeViewCreator } from '../types'
import Block from './block'

class SectionTitle extends Block {
  protected get elementType() {
    return 'h1'
  }

  protected updateContents() {
    if (this.node.childCount) {
      this.contentDOM.classList.remove('empty-node')
    } else {
      this.contentDOM.classList.add('empty-node')

      const $pos = this.view.state.doc.resolve(this.getPos())

      this.contentDOM.setAttribute(
        'data-placeholder',
        `${sectionLevel($pos.depth)} heading`
      )
    }
  }
}

const sectionTitle = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new SectionTitle(props, node, view, getPos)

export default sectionTitle
