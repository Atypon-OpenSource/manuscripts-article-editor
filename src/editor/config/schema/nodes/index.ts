import { NodeSpec } from 'prosemirror-model'
import { nodes as basic } from 'prosemirror-schema-basic'
import { StringMap } from '../../types'
import { article } from './article'
import { bibliography } from './bibliography'
import { bibliographySection } from './bibliography_section'
import { caption } from './caption'
import { citation } from './citation'
import { codeBlock } from './code_block'
import { crossReference } from './cross_reference'
import { equation } from './equation'
import { equationBlock } from './equation_block'
import { figcaption } from './figcaption'
import { figure } from './figure'
import { listNodes } from './list'
import { manuscript } from './manuscript'
import { paragraph } from './paragraph'
import { section } from './section'
import { sectionTitle } from './section_title'
import { tableNodes } from './table'
import { tableFigure } from './table_figure'
import { title } from './title'

const combinedNodes: StringMap<NodeSpec> = {
  ...listNodes,
  ...tableNodes,
  article,
  bibliography,
  bibliography_section: bibliographySection,
  blockquote: basic.blockquote,
  caption,
  citation,
  code_block: codeBlock,
  cross_reference: crossReference,
  doc: basic.doc,
  equation,
  equation_block: equationBlock,
  figcaption,
  figure,
  hard_break: basic.hard_break,
  horizontal_rule: basic.horizontal_rule,
  image: basic.image,
  manuscript,
  paragraph,
  section,
  section_title: sectionTitle,
  table_figure: tableFigure,
  text: basic.text,
  title,
}

export default combinedNodes
