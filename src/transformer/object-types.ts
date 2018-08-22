import { AnyContainedComponent, ManuscriptComponent } from '../types/components'

export const AFFILIATION = 'MPAffiliation'
export const AUXILIARY_OBJECT_REFERENCE = 'MPAuxiliaryObjectReference'
export const BIBLIOGRAPHIC_DATE = 'MPBibliographicDate'
export const BIBLIOGRAPHIC_NAME = 'MPBibliographicName'
export const BIBLIOGRAPHY_ELEMENT = 'MPBibliographyElement'
export const BIBLIOGRAPHY_ITEM = 'MPBibliographyItem'
export const BIBLIOGRAPHY_SECTION = 'MPSection'
export const BORDER_STYLE = 'MPBorderStyle'
export const CITATION = 'MPCitation'
export const CITATION_ITEM = 'MPCitationItem'
export const CONTRIBUTOR = 'MPContributor'
export const EQUATION_ELEMENT = 'MPEquationElement'
export const FIGURE = 'MPFigure'
export const FIGURE_ELEMENT = 'MPFigureElement'
export const FIGURE_STYLE = 'MPFigureStyle'
export const KEYWORD = 'MPKeyword'
export const LIST_ELEMENT = 'MPListElement'
export const LISTING_ELEMENT = 'MPListingElement'
export const MANUSCRIPT = 'MPManuscript'
export const PARAGRAPH_ELEMENT = 'MPParagraphElement'
export const PROJECT = 'MPProject'
export const PROJECT_INVITATION = 'MPProjectInvitation'
export const SECTION = 'MPSection'
export const TABLE = 'MPTable'
export const TABLE_ELEMENT = 'MPTableElement'
export const USER_PROFILE = 'MPUserProfile'

export const elementObjects = [
  BIBLIOGRAPHY_ELEMENT,
  EQUATION_ELEMENT,
  FIGURE_ELEMENT,
  LIST_ELEMENT,
  LISTING_ELEMENT,
  PARAGRAPH_ELEMENT,
  TABLE_ELEMENT,
]

export const manuscriptObjects = [
  AFFILIATION,
  BIBLIOGRAPHY_SECTION,
  CITATION,
  CONTRIBUTOR,
  SECTION,
].concat(elementObjects) // TODO: remove elementObjects if they don't need `manuscriptID`

export const isManuscriptComponent = (
  component: Partial<AnyContainedComponent>
): component is ManuscriptComponent => {
  // TODO: check all required fields
  if (!component.objectType) {
    throw new Error('Component must have objectType')
  }

  return manuscriptObjects.includes(component.objectType)
}
