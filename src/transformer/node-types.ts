const nodeTypes: Map<string, string> = new Map([
  ['bibliography', 'MPBibliographyElement'],
  ['bibliography_item', 'MPBibliographyItem'],
  ['bibliography_section', 'MPSection'],
  ['citation_item', 'MPCitationItem'],
  ['citation', 'MPCitation'],
  ['code_block', 'MPListingElement'],
  ['cross_reference', 'MPAuxiliaryObjectReference'],
  ['equation_block', 'MPEquationElement'],
  ['figure', 'MPFigureElement'],
  ['figure_image', 'MPFigure'],
  ['bullet_list', 'MPListElement'],
  ['ordered_list', 'MPListElement'],
  ['manuscript', 'MPManuscript'],
  ['paragraph', 'MPParagraphElement'],
  ['section', 'MPSection'],
  ['table', 'MPTable'],
  ['table_figure', 'MPTableElement'],
])

export default nodeTypes
