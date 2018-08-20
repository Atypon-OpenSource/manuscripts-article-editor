import { generateID } from '../transformer/id'
import {
  AFFILIATION,
  AUXILIARY_OBJECT_REFERENCE,
  BIBLIOGRAPHIC_DATE,
  BIBLIOGRAPHIC_NAME,
  BIBLIOGRAPHY_ITEM,
  CITATION,
  CITATION_ITEM,
  CONTRIBUTOR,
  FIGURE,
  KEYWORD,
  MANUSCRIPT,
  PROJECT,
} from '../transformer/object-types'
import {
  Affiliation,
  AuxiliaryObjectReference,
  BibliographicDate,
  BibliographicName,
  BibliographyItem,
  Citation,
  Contributor,
  ContributorRole,
  Figure,
  Keyword,
  Manuscript,
  ManuscriptComponent,
  Project,
} from '../types/components'
import { DEFAULT_BUNDLE } from './csl'

export type Build<T> = Pick<T, Exclude<keyof T, keyof ManuscriptComponent>> & {
  id: string
  objectType: string
}

export type BuildEmbedded<T> = Pick<
  T,
  Exclude<keyof T, keyof ManuscriptComponent>
> & {
  _id: string
  objectType: string
}

export const buildProject = (owner: string): Build<Project> => ({
  id: generateID('project') as string,
  objectType: PROJECT,
  owners: [owner],
  writers: [],
  viewers: [],
  title: '',
})

export const buildManuscript = (title: string = ''): Build<Manuscript> => ({
  id: generateID('manuscript') as string,
  objectType: MANUSCRIPT,
  title,
  figureElementNumberingScheme: '',
  figureNumberingScheme: '',
  targetBundle: DEFAULT_BUNDLE,
})

export const buildContributor = (
  bibliographicName: BibliographicName,
  role: ContributorRole = 'author',
  priority: number = 0
): Build<Contributor> => ({
  id: generateID('contributor') as string,
  objectType: CONTRIBUTOR,
  priority,
  role,
  affiliations: [],
  bibliographicName,
})

export const buildBibliographyItem = (
  data: Partial<BibliographyItem>
): Build<BibliographyItem> => ({
  ...data,
  id: generateID('bibliography_item') as string,
  objectType: BIBLIOGRAPHY_ITEM,
})

export const buildBibliographicName = (
  data: Partial<BibliographicName>
): BuildEmbedded<BibliographicName> => ({
  ...data,
  _id: generateID('bibliographic_name') as string,
  objectType: BIBLIOGRAPHIC_NAME,
})

export const buildBibliographicDate = (
  data: Partial<CSL.StructuredDate>
): BuildEmbedded<BibliographicDate> => ({
  ...data,
  _id: generateID('bibliographic_date') as string,
  objectType: BIBLIOGRAPHIC_DATE,
})

export const buildAuxiliaryObjectReference = (
  containingObject: string,
  referencedObject: string
): Build<AuxiliaryObjectReference> => ({
  id: generateID('cross_reference') as string,
  objectType: AUXILIARY_OBJECT_REFERENCE,
  containingObject,
  referencedObject,
})

export const buildCitation = (
  containingObject: string,
  bibliographyItem: string
): Build<Citation> => ({
  id: generateID('citation') as string,
  objectType: CITATION,
  containingObject,
  embeddedCitationItems: [
    {
      _id: generateID('citation_item') as string,
      objectType: CITATION_ITEM,
      bibliographyItem,
    },
  ],
})

export const buildKeyword = (name: string): Build<Keyword> => ({
  id: generateID('keyword') as string,
  objectType: KEYWORD,
  name,
})

export const buildFigure = (file: File): Build<Figure> => ({
  id: generateID('figure_image') as string,
  objectType: FIGURE,
  contentType: file.type,
  src: window.URL.createObjectURL(file),
  attachment: {
    id: file.name,
    type: file.type,
    data: file,
  },
})

export const buildAffiliation = (name: string): Build<Affiliation> => ({
  id: generateID('affiliation') as string,
  objectType: AFFILIATION,
  name,
})
