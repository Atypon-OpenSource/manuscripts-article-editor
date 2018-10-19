import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'
import { placeholderContent } from '../../lib/placeholder'
import { NodeViewCreator } from '../types'

class Placeholder implements NodeView {
  public dom: HTMLElement
  private node: ProsemirrorNode

  constructor(node: ProsemirrorNode) {
    this.node = node

    this.initialise()
  }

  private initialise() {
    this.dom = document.createElement('div')
    this.dom.classList.add('placeholder-item')
    this.dom.innerHTML = placeholderContent(
      this.node.attrs.label,
      'support@manuscriptsapp.com'
    )
  }
}

const placeholder: NodeViewCreator = node => new Placeholder(node)

export default placeholder
