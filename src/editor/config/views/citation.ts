import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'

class Citation implements NodeView {
  public dom: HTMLElement

  private readonly props: EditorProps
  private node: ProsemirrorNode

  constructor(props: EditorProps, node: ProsemirrorNode) {
    this.props = props
    this.node = node
    // this.decorations = decorations

    this.createDOM()
    // this.createForm()
  }

  public update(newNode: ProsemirrorNode) {
    if (!newNode.sameMarkup(this.node)) return false
    this.node = newNode
    this.props.popper.update()
    return true
  }

  public deselectNode() {
    this.props.popper.destroy()
  }

  public stopEvent(event: Event) {
    // https://discuss.prosemirror.net/t/draggable-and-nodeviews/955/13
    return !event.type.startsWith('drag')
  }

  public ignoreMutation() {
    return true
  }

  // public selectNode() {
  //   // TODO: set form values from this node
  //   this.props.popper.show(this.dom, this.form)
  //   // input.focus()
  // }

  private createDOM() {
    this.dom = document.createElement('span')
    this.dom.className = 'citation'
    // dom.id = node.attrs.id
    this.dom.setAttribute('data-reference-id', this.node.attrs.rid)
    // dom.setAttribute('data-citation-items', node.attrs.citationItems.join('|'))
    this.dom.innerHTML = this.node.attrs.contents // TODO: sanitise!!?
  }

  // private createForm() {
  //   const form = document.createElement('form')
  //   form.className = 'citation-editor'
  //
  //   const input = document.createElement('input')
  //   input.name = 'title'
  //   input.type = 'text'
  //   input.placeholder = 'Title'
  //   form.appendChild(input)
  // }
}

const citation = (props: EditorProps): NodeViewCreator => node =>
  new Citation(props, node)

export default citation
