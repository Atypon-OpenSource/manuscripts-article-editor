import { NodeSpec } from 'prosemirror-model'
import { nodes } from 'prosemirror-schema-basic'
import { StringMap } from '../../types'
import { article } from './article'
import { bib } from './bib'
import { caption } from './caption'
import { citation } from './citation'
import { equation } from './equation'
import { equationBlock } from './equation_block'
import { figcaption } from './figcaption'
import { figimage } from './figimage'
import { figure } from './figure'
import { listNodes } from './list'
import { manuscript } from './manuscript'
import { paragraph } from './paragraph'
import { section } from './section'
import { sectionTitle } from './section_title'
import { tableNodes } from './table'
import { title } from './title'

const combinedNodes: StringMap<NodeSpec> = {
  ...nodes,
  ...listNodes,
  ...tableNodes,
  article,
  bib,
  caption,
  citation,
  equation,
  equation_block: equationBlock,
  figcaption,
  figimage,
  figure,
  manuscript,
  paragraph,
  section,
  section_title: sectionTitle,
  title,
}

export default combinedNodes
