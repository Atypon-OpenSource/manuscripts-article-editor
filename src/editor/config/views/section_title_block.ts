import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class SectionTitleBlock extends Block {
  protected get elementType() {
    return 'h1'
  }

  protected get objectName() {
    return 'Section'
  }
}

const sectionTitleBlock = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new SectionTitleBlock(props, node, view, getPos)

export default sectionTitleBlock
