import { EditorProps } from '../../Editor'
import { NodeViewCreator } from '../types'
import Block from './block'

class TableFigureBlock extends Block {
  protected get elementType() {
    return 'figure'
  }

  protected get objectName() {
    return 'Table'
  }
}

const tableFigure = (props: EditorProps): NodeViewCreator => (
  node,
  view,
  getPos
) => new TableFigureBlock(props, node, view, getPos)

export default tableFigure
