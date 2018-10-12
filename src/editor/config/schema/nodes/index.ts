import { NodeSpec } from 'prosemirror-model'
import { nodes as basic } from 'prosemirror-schema-basic'
import { bibliographyElement } from './bibliography_element'
import { bibliographySection } from './bibliography_section'
import { caption } from './caption'
import { citation } from './citation'
import { crossReference } from './cross_reference'
import { doc } from './doc'
import { equation } from './equation'
import { equationElement } from './equation_element'
import { figcaption } from './figcaption'
import { figureElement } from './figure_element'
import { footnote } from './footnote'
import { footnotesElement } from './footnotes_element'
import { inlineEquation } from './inline_equation'
import { inlineFootnote } from './inline_footnote'
import { ListNodes, listNodes } from './list'
import { listing } from './listing'
import { listingElement } from './listing_element'
import { manuscript } from './manuscript'
import { paragraph } from './paragraph'
import { placeholder } from './placeholder'
import { placeholderElement } from './placeholder_element'
import { section } from './section'
import { sectionTitle } from './section_title'
import { TableNodes, tableNodes } from './table'
import { tableElement } from './table_element'
import { tocElement } from './toc_element'
import { tocSection } from './toc_section'

export type Nodes =
  | 'bibliography_element'
  | 'bibliography_section'
  | 'blockquote'
  | 'caption'
  | 'citation'
  | 'cross_reference'
  | 'doc'
  | 'equation'
  | 'equation_element'
  | 'figcaption'
  // | 'figure' TODO
  | 'figure_element'
  | 'footnote'
  | 'footnotes_element'
  | 'hard_break'
  | 'horizontal_rule'
  | 'inline_equation'
  | 'inline_footnote'
  | 'listing'
  | 'listing_element'
  | 'manuscript'
  | 'paragraph'
  | 'placeholder'
  | 'placeholder_element'
  | 'section'
  | 'section_title'
  | 'section_title'
  | 'table_element'
  | 'text'
  | 'toc_element'
  | 'toc_section'
  | ListNodes
  | TableNodes

const combinedNodes: { [key in Nodes]: NodeSpec } = {
  ...listNodes,
  ...tableNodes,
  manuscript,
  bibliography_element: bibliographyElement,
  bibliography_section: bibliographySection,
  blockquote: basic.blockquote,
  caption,
  citation,
  cross_reference: crossReference,
  doc,
  equation,
  equation_element: equationElement,
  figcaption,
  figure_element: figureElement,
  footnote,
  footnotes_element: footnotesElement,
  hard_break: basic.hard_break,
  horizontal_rule: basic.horizontal_rule,
  inline_equation: inlineEquation,
  inline_footnote: inlineFootnote,
  listing,
  listing_element: listingElement,
  paragraph,
  placeholder,
  placeholder_element: placeholderElement,
  section,
  section_title: sectionTitle,
  table_element: tableElement,
  text: basic.text,
  toc_element: tocElement,
  toc_section: tocSection,
}

export default combinedNodes
