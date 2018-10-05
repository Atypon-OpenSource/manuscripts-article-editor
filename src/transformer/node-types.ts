import { Node as ProsemirrorNode } from 'prosemirror-model'

export type NodeTypeName =
  | 'affiliation'
  | 'bibliographic_date'
  | 'bibliographic_name'
  | 'bibliography_element'
  | 'bibliography_item'
  | 'bibliography_section'
  | 'bullet_list'
  | 'citation'
  | 'citation_item'
  | 'comment'
  | 'contributor'
  | 'cross_reference'
  | 'equation'
  | 'equation_element'
  | 'figure'
  | 'figure_element'
  | 'footnote'
  | 'footnotes_element'
  | 'inline_equation'
  | 'keyword'
  | 'listing'
  | 'listing_element'
  | 'manuscript'
  | 'ordered_list'
  | 'paragraph'
  | 'project'
  | 'section'
  | 'table'
  | 'table_element'
  | 'toc_element'
  | 'toc_section'

const elementNodeTypes: NodeTypeName[] = [
  'listing_element',
  'equation_element',
  'figure_element',
  'bullet_list',
  'ordered_list',
  'paragraph',
  'table_element',
]

export const isElementNode = (node: ProsemirrorNode) =>
  elementNodeTypes.includes(node.type.name as NodeTypeName)

const nodeTypes: Array<[NodeTypeName, string]> = [
  ['affiliation', 'MPAffiliation'],
  ['bibliographic_date', 'MPBibliographicDate'],
  ['bibliographic_name', 'MPBibliographicName'],
  ['bibliography_element', 'MPBibliographyElement'],
  ['bibliography_item', 'MPBibliographyItem'],
  ['bibliography_section', 'MPSection'],
  ['bullet_list', 'MPListElement'],
  ['citation', 'MPCitation'],
  ['citation_item', 'MPCitationItem'],
  ['comment', 'MPComment'],
  ['contributor', 'MPContributor'],
  ['cross_reference', 'MPAuxiliaryObjectReference'],
  ['equation', 'MPEquation'],
  ['equation_element', 'MPEquationElement'],
  ['figure', 'MPFigure'],
  ['figure_element', 'MPFigureElement'],
  ['footnote', 'MPFootnote'],
  ['footnotes_element', 'MPFootnotesElement'],
  ['inline_equation', 'MPInlineMathFragment'],
  ['keyword', 'MPKeyword'],
  ['listing', 'MPListing'],
  ['listing_element', 'MPListingElement'],
  ['manuscript', 'MPManuscript'],
  ['ordered_list', 'MPListElement'],
  ['paragraph', 'MPParagraphElement'],
  ['project', 'MPProject'],
  ['section', 'MPSection'],
  ['table', 'MPTable'],
  ['table_element', 'MPTableElement'],
  ['toc_element', 'MPTOCElement'],
  ['toc_section', 'MPSection'],
]

const nodeTypesMap: Map<NodeTypeName, string> = new Map(nodeTypes)

export default nodeTypesMap
