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

const tableFigure: NodeViewCreator = (node, view, getPos) =>
  new TableFigureBlock(node, view, getPos)

export default tableFigure
