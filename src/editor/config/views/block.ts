import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import AbstractBlock from './abstract_block'

class Block extends AbstractBlock {
  public constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number
  ) {
    super(node, view, getPos)

    this.initialise()
  }
}

export default Block
