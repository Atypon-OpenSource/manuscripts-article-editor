import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { placeholderContent } from '../../lib/placeholder'
import { NodeViewCreator } from '../types'
import Block from './block'

class PlaceholderElement extends Block {
  private element: HTMLElement

  protected get elementType() {
    return 'div'
  }

  public constructor(
    props: EditorProps,
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
  ) {
    super(props, node, view, getPos)

    this.initialise()
  }

  protected createElement() {
    this.element = document.createElement(this.elementType)
    this.element.className = 'block'
    this.element.setAttribute('id', this.node.attrs.id)
    this.dom.appendChild(this.element)

    const content = document.createElement('div')
    content.className = 'placeholder-item'
    content.innerHTML = placeholderContent('An element')
    this.element.appendChild(content)
  }

  protected updateContents() {
    // empty
  }
}

const placeholderElement = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new PlaceholderElement(props, node, view, getPos)

export default placeholderElement
