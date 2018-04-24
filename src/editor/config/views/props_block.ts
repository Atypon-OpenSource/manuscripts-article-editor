import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { EditorProps } from '../../Editor'
import Block from './block'

class PropsBlock extends Block {
  protected props: EditorProps

  constructor(
    props: EditorProps,
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
  ) {
    super(node, view, getPos)
    this.props = props
  }
}

export default PropsBlock
