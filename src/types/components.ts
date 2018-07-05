import { RxAttachment, RxCollection, RxDocument } from 'rxdb'
import { RxAttachmentCreator } from 'rxdb/src/typings/rx-attachment'

export interface Attachment {
  id: string
  type: string
  data: object
}

export interface Component {
  // _id: string
  _rev?: string
  _deleted?: boolean
  id: string
  objectType: string
  createdAt?: number
  updatedAt?: number
  sessionID?: string
  // keywordIDs?: string[]
}

export interface EmbeddedComponent {
  _id: string
  objectType: string
}

export interface ContainedComponent extends Component {
  containerID: string
}

export interface ManuscriptComponent extends ContainedComponent {
  manuscriptID: string
}

export interface Style extends Component {
  name: string
  title: string
  subtitle: string
  desc: string
}

export interface Color extends Component {
  deviceColor: string
  name: string
  title: string
  value: string
}

export interface Border extends Component {
  color: Color
  style: string // BorderStyle
  width: number
}

export interface BorderStyle extends Style {
  doubleLines: boolean
}

export interface FigureStyle extends Style {
  captionPosition: number
  innerBorder: Border
  innerSpacing: number
  outerBorder: Border
  outerSpacing: number
  preferredXHTMLElement?: string
  alignment: string
}

export type ContainedBorderStyle = BorderStyle & ManuscriptComponent
export type ContainedFigureStyle = FigureStyle & ManuscriptComponent

export interface Project extends Component {
  title: string
  owners: string[]
  writers: string[]
  viewers: string[]
}

export interface Manuscript extends ContainedComponent {
  title: string
  data?: string
  citationStyle?: string // TODO: bundle or targetBundle, which contains CSLIdentifier
  primaryLanguageCode?: string
  figureElementNumberingScheme: string // TODO: optional
  figureNumberingScheme: string // TODO: optional
}

export interface BibliographicName extends EmbeddedComponent {
  given?: string
  family?: string
  droppingParticle?: string
  nonDroppingParticle?: string
  suffix?: string
  literal?: string
}

export type ContributorRole = 'author'

export interface Keyword extends ContainedComponent {
  name: string
}

export interface Contributor extends ManuscriptComponent {
  affiliations?: string[] // MPAffiliation IDs
  bibliographicName: BibliographicName
  email?: string
  grants?: string[] // MPGrant IDs
  isCorresponding?: boolean
  isJointContributor?: boolean
  phoneNumber?: string
  priority?: number
  researchFields?: string[] // MPResearchField IDs
  role?: ContributorRole
  url?: string
  image?: string
  profileID?: string
}

export interface UserProfile extends Component {
  avatar?: string // TODO
  affiliations?: string[] // MPAffiliation IDs
  bibliographicName: BibliographicName
  email?: string
  grants?: string[] // MPGrant IDs
  researchFields?: string[] // MPResearchField IDs
  url?: string
  image?: string
  userID: string
}

export interface Affiliation extends ManuscriptComponent {
  name: string
  address?: string
  city?: string
  institution?: string
}

export interface Grant extends ManuscriptComponent {
  organization: string
  code: string
  title: string
  fundingBody: string
}

export interface Section extends ContainedComponent {
  priority: number
  title: string
  path: string[]
  elementIDs: string[]
}

export interface Table extends ContainedComponent {
  // caption: string
  contents: string
}

export interface Figure extends ContainedComponent {
  contentType: string
  src?: string
  attachment?: Attachment
  originalURL?: string
  title?: string // TODO: make this editable
}

type Year = string | number
type Month = string | number
type Day = string | number

type DatePart = [Year] | [Year, Month] | [Year, Month, Day]

export interface AuxiliaryObjectReference extends ContainedComponent {
  containingObject: string
  referencedObject: string
  auxiliaryObjectReferenceStyle?: string
}

export interface BibliographicDate extends EmbeddedComponent {
  circa?: boolean
  'date-parts'?: [DatePart] | [DatePart, DatePart]
  literal?: string
  raw?: string
  season?: string
}

export interface BibliographyItem extends ContainedComponent {
  [key: string]: BibliographyItem[keyof BibliographyItem]
  'citation-label'?: string
  title?: string
  DOI?: string
  URL?: string
  volume?: string
  'page-first'?: string
  issued?: BibliographicDate
  originalIdentifier?: string
  number?: string // TODO: number?
  author?: BibliographicName[]
  embeddedAuthors?: BibliographicName[]
  sourceIdentifier?: string
  sourceURI?: string
  'number-of-pages'?: string // TODO: number?
  institution?: string
  'collection-title'?: string
  keyword?: string
}

export interface Citation extends ContainedComponent {
  containingObject: string
  embeddedCitationItems: CitationItem[]
  collationType?: number
  citationStyle?: string
}

export interface CitationItem extends EmbeddedComponent {
  bibliographyItem: string
}

export interface Element extends ContainedComponent {
  elementType: string
  placeholderInnerHTML?: string
}

export interface ParagraphElement extends Element {
  elementType: 'p'
  contents: string
  paragraphStyle: string
}

export interface UnorderedListElement extends Element {
  elementType: 'ul'
  contents: string
  paragraphStyle: string
}

export interface OrderedListElement extends Element {
  elementType: 'ol'
  contents: string
  paragraphStyle: string
}

export interface EquationElement extends Element {
  TeXRepresentation: string
  // SVGStringRepresentation: string
  // MathMLStringRepresentation: string
  // OMMLStringRepresentation: string
}

export interface FigureElement extends Element {
  elementType: 'figure'
  caption: string
  containedObjectIDs: string[]
  figureLayout: string
  figureStyle: string
}

export interface ListingElement extends Element {
  // elementType: 'pre'
  contents: string
  language: string
  languageKey: string
}

export interface TableElement extends Element {
  elementType: 'table'
  caption: string
  containedObjectID: string
}

export interface BibliographyElement extends Element {
  elementType: 'div'
  contents: string
}

export type AnyStyle = FigureStyle | BorderStyle

export type AnyElement =
  | BibliographyElement
  | EquationElement
  | FigureElement
  | ListingElement
  | OrderedListElement
  | ParagraphElement
  | TableElement
  | UnorderedListElement

export type AnySharedComponent = AnyStyle | Border

export type AnyManuscriptComponent =
  | Contributor
  | Affiliation
  | Grant
  | AnyElement

export type AnyContainedComponent =
  | AnyManuscriptComponent
  | Manuscript
  | Keyword
  | BibliographyItem
  | Citation
  | Section
  | Table
  | Figure
  | AuxiliaryObjectReference

export type AnyComponent = AnySharedComponent | AnyContainedComponent

export interface Attachments {
  _attachments: Array<RxAttachment<AnyComponent>>
}

export interface ComponentAttachment {
  attachment?: RxAttachmentCreator
  src?: string
}

export type PrioritizedComponent = Section | Figure

export type ComponentIdSet = Set<string>

export type ComponentDocument = RxDocument<AnyContainedComponent & Attachments>

export type ComponentWithAttachment = AnyComponent & ComponentAttachment

export type ComponentMap = Map<string, ComponentWithAttachment>

export type ComponentCollection = RxCollection<AnyComponent>

export type ReferencedComponent =
  | FigureElement
  | Figure
  | TableElement
  | EquationElement
  | ListingElement

export type ComponentWithCaption = FigureElement | TableElement

export type ComponentWithContents =
  | ParagraphElement
  | UnorderedListElement
  | OrderedListElement
