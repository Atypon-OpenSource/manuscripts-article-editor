import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'
import { AuxiliaryObjectReference } from '../../../types/components'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'

class CrossReference implements NodeView {
  public dom: HTMLElement

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
    // this.props.popper.update()
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
    const auxiliaryObjectReference = this.props.getComponent<
      AuxiliaryObjectReference
    >(this.node.attrs.rid)

    this.dom = document.createElement('a')
    this.dom.className = 'cross-reference'
    this.dom.setAttribute(
      'href',
      '#' + auxiliaryObjectReference.referencedObject
    )
  }

  private updateContents() {
    this.dom.textContent = this.node.attrs.label
  }

  // private createForm() {
  //   const form = document.createElement('form')
  //   form.className = 'cross-reference-editor'
  // }
}

const crossReference = (props: EditorProps): NodeViewCreator => node =>
  new CrossReference(props, node)

export default crossReference
