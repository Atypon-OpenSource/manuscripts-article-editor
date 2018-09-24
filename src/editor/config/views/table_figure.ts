import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class TableFigureBlock extends Block {
  private element: HTMLElement

  protected get elementType() {
    return 'figure'
  }

  protected get objectName() {
    return 'Table'
  }

  public update(newNode: ProsemirrorNode) {
    if (newNode.type.name !== this.node.type.name) return false
    if (newNode.attrs.id !== this.node.attrs.id) return false
    this.node = newNode
    this.contentDOM.classList.toggle(
      'suppress-header',
      this.node.attrs.suppressHeader
    )
    this.contentDOM.classList.toggle(
      'suppress-footer',
      this.node.attrs.suppressFooter
    )
    this.updateContents()
    return true
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

const tableFigure = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new TableFigureBlock(props, node, view, getPos)

export default tableFigure
