import { EditorProps } from '../../Editor'
import bibliographyBlock from './bibliography_block'
import bulletListBlock from './bullet_list_block'
import citation from './citation'
import codeBlock from './code_block'
import crossReference from './cross_reference'
import equation from './equation'
import equationBlock from './equation_block'
import figureBlock from './figure_block'
import orderedListBlock from './ordered_list_block'
// import figcaption from './figcaption'
import paragraphBlock from './paragraph_block'
import sectionTitleBlock from './section_title_block'
import tableFigure from './table_figure'

export default (props: EditorProps) => ({
  bibliography: bibliographyBlock,
  bullet_list: bulletListBlock,
  citation: citation(props),
  code_block: codeBlock(props),
  cross_reference: crossReference(props),
  equation: equation(props),
  equation_block: equationBlock(props),
  figure: figureBlock,
  // figcaption: figcaption(props),
  ordered_list: orderedListBlock,
  paragraph: paragraphBlock,
  section_title: sectionTitleBlock,
  table_figure: tableFigure,
})
