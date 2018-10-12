import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class TableElement extends Block {
  protected get elementType() {
    return 'figure'
  }

  public update(newNode: ProsemirrorNode) {
    if (newNode.type.name !== this.node.type.name) return false
    if (newNode.attrs.id !== this.node.attrs.id) return false
    this.node = newNode
    this.updateContents()
    return true
  }

  protected updateContents() {
    const { suppressCaption, suppressHeader, suppressFooter } = this.node.attrs

    this.dom.classList.toggle('suppress-caption', suppressCaption)
    this.dom.classList.toggle('suppress-header', suppressHeader)
    this.dom.classList.toggle('suppress-footer', suppressFooter)
  }

  protected createElement() {
    this.contentDOM = document.createElement('figure')
    this.contentDOM.classList.add('block')
    this.contentDOM.id = this.node.attrs.id
    this.contentDOM.setAttribute(
      'data-paragraph-style',
      this.node.attrs.paragraphStyle
    )
    this.contentDOM.setAttribute('data-table-style', this.node.attrs.tableStyle)
    this.dom.appendChild(this.contentDOM)
  }
}

const tableElement = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new TableElement(props, node, view, getPos)

export default tableElement
