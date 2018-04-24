import { EditorProps } from '../../Editor'
import citation from './citation'
import codeBlock from './code_block'
import crossReference from './cross_reference'
import equation from './equation'
import equationBlock from './equation_block'
import figureBlock from './figure_block'
// import figcaption from './figcaption'
import paragraphBlock from './paragraph_block'
import sectionTitleBlock from './section_title_block'
import tableFigure from './table_figure'

export default (props: EditorProps) => ({
  citation: citation(props),
  code_block: codeBlock(props),
  cross_reference: crossReference(props),
  equation: equation(props),
  equation_block: equationBlock(props),
  figure: figureBlock,
  // figcaption: figcaption(props),
  paragraph: paragraphBlock,
  section_title: sectionTitleBlock,
  table_figure: tableFigure,
})
