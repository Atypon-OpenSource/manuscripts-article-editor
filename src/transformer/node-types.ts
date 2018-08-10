export type NodeTypeName =
  | 'affiliation'
  | 'bibliographic_date'
  | 'bibliographic_name'
  | 'bibliography'
  | 'bibliography_item'
  | 'bibliography_section'
  | 'bullet_list'
  | 'citation'
  | 'citation_item'
  | 'code_block'
  | 'contributor'
  | 'cross_reference'
  | 'equation_block'
  | 'figure'
  | 'figure_image'
  | 'keyword'
  | 'manuscript'
  | 'ordered_list'
  | 'paragraph'
  | 'project'
  | 'section'
  | 'table'
  | 'table_figure'

export const elementNodeTypes: NodeTypeName[] = [
  'equation_block',
  'figure',
  'bullet_list',
  'ordered_list',
  'paragraph',
  'table_figure',
]

const nodeTypes: Array<[NodeTypeName, string]> = [
  ['affiliation', 'MPAffiliation'],
  ['bibliographic_date', 'MPBibliographicDate'],
  ['bibliographic_name', 'MPBibliographicName'],
  ['bibliography', 'MPBibliographyElement'],
  ['bibliography_item', 'MPBibliographyItem'],
  ['bibliography_section', 'MPSection'],
  ['citation_item', 'MPCitationItem'],
  ['citation', 'MPCitation'],
  ['code_block', 'MPListingElement'],
  ['contributor', 'MPContributor'],
  ['cross_reference', 'MPAuxiliaryObjectReference'],
  ['equation_block', 'MPEquationElement'],
  ['figure', 'MPFigureElement'],
  ['figure_image', 'MPFigure'],
  ['keyword', 'MPKeyword'],
  ['bullet_list', 'MPListElement'],
  ['ordered_list', 'MPListElement'],
  ['manuscript', 'MPManuscript'],
  ['paragraph', 'MPParagraphElement'],
  ['project', 'MPProject'],
  ['section', 'MPSection'],
  ['table', 'MPTable'],
  ['table_figure', 'MPTableElement'],
]

const nodeTypesMap: Map<NodeTypeName, string> = new Map(nodeTypes)

export default nodeTypesMap
