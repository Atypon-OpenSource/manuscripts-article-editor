import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'

class InlineFootnote implements NodeView {
  public dom: HTMLElement

  private readonly props: EditorProps
  private node: ProsemirrorNode

  constructor(props: EditorProps, node: ProsemirrorNode) {
    this.props = props
    this.node = node

    this.createDOM()
    this.updateContents().catch(error => {
      console.error(error) // tslint:disable-line:no-console
    })
  }

  public update(newNode: ProsemirrorNode): boolean {
    if (!newNode.sameMarkup(this.node)) return false
    this.node = newNode
    this.updateContents().catch(error => {
      console.error(error) // tslint:disable-line:no-console
    })
    this.props.popper.update()
    return true
  }

  public async selectNode() {
    // TODO: select and scroll to the footnote without changing the URL?
    this.props.history.push('#' + this.node.attrs.rid)
  }

  public deselectNode() {
    this.props.popper.destroy()
  }

  public stopEvent(event: Event) {
    return event.type !== 'mousedown' && !event.type.startsWith('drag')
  }

  public ignoreMutation() {
    return true
  }

  protected get elementType() {
    return 'span'
  }

  protected async updateContents() {
    this.dom.textContent = this.node.attrs.contents
  }

  protected createDOM() {
    this.dom = document.createElement(this.elementType)
    this.dom.classList.add('footnote')
  }
}

const inlineFootnote = (props: EditorProps): NodeViewCreator => node =>
  new InlineFootnote(props, node)

export default inlineFootnote
