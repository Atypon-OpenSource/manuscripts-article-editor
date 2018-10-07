import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class TableElement extends Block {
  private element: HTMLElement

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
    this.element = document.createElement(this.elementType)
    this.element.className = 'block'
    this.element.id = this.node.attrs.id
    this.element.setAttribute('data-table-style', this.node.attrs.tableStyle)

    this.contentDOM = document.createElement('div')
    this.element.appendChild(this.contentDOM)

    this.dom.appendChild(this.element)
  }
}

const tableElement = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new TableElement(props, node, view, getPos)

export default tableElement
