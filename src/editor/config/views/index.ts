import { EditorProps } from '../../Editor'
import bibliographyElement from './bibliography_element'
import bulletList from './bullet_list'
import citation from './citation'
import crossReference from './cross_reference'
import equation from './equation'
import equationElement from './equation_element'
import figureElement from './figure_element'
import inlineEquation from './inline_equation'
import inlineFootnote from './inline_footnote'
import listing from './listing'
import listingElement from './listing_element'
import orderedList from './ordered_list'
import paragraph from './paragraph'
import placeholder from './placeholder'
import placeholderElement from './placeholder_element'
import sectionTitle from './section_title'
import tableElement from './table_element'
import tocElement from './toc_element'

export default (props: EditorProps) => ({
  bibliography_element: bibliographyElement(props),
  bullet_list: bulletList(props),
  citation: citation(props),
  cross_reference: crossReference(props),
  equation: equation(props),
  equation_element: equationElement(props),
  figure_element: figureElement(props),
  inline_equation: inlineEquation(props),
  inline_footnote: inlineFootnote(props),
  listing: listing(props),
  listing_element: listingElement(props),
  ordered_list: orderedList(props),
  paragraph: paragraph(props),
  placeholder,
  placeholder_element: placeholderElement(props),
  section_title: sectionTitle(props),
  table_element: tableElement(props),
  toc_element: tocElement(props),
})
