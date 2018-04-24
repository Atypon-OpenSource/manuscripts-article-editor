import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'

class FigureCaption implements NodeView {
  public contentDOM: HTMLElement

  private readonly props: EditorProps
  private node: ProsemirrorNode

  constructor(props: EditorProps, node: ProsemirrorNode) {
    this.props = props
    this.node = node

    this.createDOM()
    this.updateContents()
  }

  public update(newNode: ProsemirrorNode) {
    if (!newNode.sameMarkup(this.node)) return false
    this.node = newNode
    this.updateContents()
    this.props.popper.update()
    return true
  }

  public deselectNode() {
    this.props.popper.destroy()
  }

  public stopEvent(event: Event) {
    return true
  }

  public ignoreMutation() {
    return true
  }

  private createDOM() {
    this.contentDOM = document.createElement('span')
  }

  private updateContents() {
    if (!this.node.childCount) {
      const placeholder = document.createElement('span')
      placeholder.className = 'caption-placeholder'
      placeholder.textContent = '<Caption>'
      this.contentDOM.appendChild(placeholder)
    }
  }
}

const figcaption = (props: EditorProps): NodeViewCreator => node =>
  new FigureCaption(props, node)

export default figcaption
