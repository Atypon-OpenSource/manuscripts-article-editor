import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class EquationElement extends Block {
  protected get elementType() {
    return 'figure'
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

  public update(newNode: ProsemirrorNode) {
    if (newNode.type.name !== this.node.type.name) return false
    if (newNode.attrs.id !== this.node.attrs.id) return false
    this.node = newNode
    this.updateContents().catch(error => {
      console.error(error) // tslint:disable-line:no-console
    })
    return true
  }

  public deselectNode() {
    this.props.popper.destroy()
  }

  protected async updateContents() {
    const { suppressCaption } = this.node.attrs

    this.dom.classList.toggle('suppress-caption', suppressCaption)
  }
}

const equationElement = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new EquationElement(props, node, view, getPos)

export default equationElement
