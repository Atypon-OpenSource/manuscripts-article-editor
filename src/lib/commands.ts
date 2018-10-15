import { generateID } from '../transformer/id'
import {
  AFFILIATION,
  AUXILIARY_OBJECT_REFERENCE,
  BIBLIOGRAPHIC_DATE,
  BIBLIOGRAPHIC_NAME,
  BIBLIOGRAPHY_ITEM,
  CITATION,
  CITATION_ITEM,
  COMMENT_ANNOTATION,
  CONTRIBUTOR,
  FIGURE,
  FOOTNOTE,
  INLINE_MATH_FRAGMENT,
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
  CommentAnnotation,
  CommentSelector,
  Contributor,
  ContributorRole,
  Figure,
  Footnote,
  InlineMathFragment,
  Keyword,
  Manuscript,
  ManuscriptComponent,
  Project,
} from '../types/components'
import { DEFAULT_BUNDLE } from './csl'

export type Build<T> = Pick<T, Exclude<keyof T, keyof ManuscriptComponent>> & {
  _id: string
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
  _id: generateID('project') as string,
  objectType: PROJECT,
  owners: [owner],
  writers: [],
  viewers: [],
  title: '',
})

export const buildManuscript = (title: string = ''): Build<Manuscript> => ({
  _id: generateID('manuscript') as string,
  objectType: MANUSCRIPT,
  title,
  bundle: DEFAULT_BUNDLE,
})

export const buildContributor = (
  bibliographicName: BibliographicName,
  role: ContributorRole = 'author',
  priority: number = 0,
  userID?: string | null,
  invitationID?: string
): Build<Contributor> => ({
  _id: generateID('contributor') as string,
  objectType: CONTRIBUTOR,
  priority,
  role,
  affiliations: [],
  bibliographicName: buildBibliographicName(bibliographicName),
  userID,
  invitationID,
})

export const buildBibliographyItem = (
  data: Partial<BibliographyItem>
): Build<BibliographyItem> => ({
  ...data,
  _id: generateID('bibliography_item') as string,
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
  _id: generateID('cross_reference') as string,
  objectType: AUXILIARY_OBJECT_REFERENCE,
  containingObject,
  referencedObject,
})

export const buildCitation = (
  containingObject: string,
  bibliographyItem: string
): Build<Citation> => ({
  _id: generateID('citation') as string,
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
  _id: generateID('keyword') as string,
  objectType: KEYWORD,
  name,
})

export const buildFigure = (file: File): Build<Figure> => ({
  _id: generateID('figure') as string,
  objectType: FIGURE,
  contentType: file.type,
  src: window.URL.createObjectURL(file),
  attachment: {
    id: file.name, // TODO: unique id?
    type: file.type,
    data: file,
  },
})

export const buildAffiliation = (name: string): Build<Affiliation> => ({
  _id: generateID('affiliation') as string,
  objectType: AFFILIATION,
  name,
})

export const buildComment = (
  userID: string,
  target: string,
  contents: string = '',
  selector?: CommentSelector
): Build<CommentAnnotation> => ({
  _id: generateID('comment') as string,
  objectType: COMMENT_ANNOTATION,
  userID,
  target,
  selector,
  contents,
})

export const buildInlineMathFragment = (
  containingObject: string,
  TeXRepresentation: string
): Build<InlineMathFragment> => ({
  _id: generateID('inline_equation') as string,
  objectType: INLINE_MATH_FRAGMENT,
  containingObject,
  TeXRepresentation,
})

export const buildFootnote = (
  containingObject: string,
  contents: string
): Build<Footnote> => ({
  _id: generateID('footnote') as string,
  objectType: FOOTNOTE,
  containingObject,
  contents,
})
