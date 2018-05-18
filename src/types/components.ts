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
  manuscript?: string
  sessionID?: string
  keywordIDs?: string[]
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

export interface BorderStyle extends Component {
  doubleLines: boolean
}

export interface Border extends Component {
  color: Color
  style: string // BorderStyle
  width: number
}

export interface FigureStyle extends Component {
  captionPosition: number
  innerBorder: Border
  innerSpacing: number
  outerBorder: Border
  outerSpacing: number
  preferredXHTMLElement?: string
  alignment: string
}

export interface Project extends Component {
  project: string
  title: string
  owners?: string[]
}

export interface Manuscript extends Component {
  project: string
  title: string
  data?: string
  owners?: string[]
  citationStyle?: string
  locale?: string
}

export interface BibliographicName extends Component {
  given?: string
  family?: string
  droppingParticle?: string
  nonDroppingParticle?: string
  suffix?: string
  literal?: string
}

export type ContributorRole = 'author'

export interface Keyword extends Component {
  name: string
}

export interface Keyword extends Component {
  name: string
}

export interface Contributor extends Component {
  affiliations?: string[] // MPAffiliation IDs
  bibliographicName: BibliographicName
  email?: string
  grants?: string[] // MPGrant IDs
  isCorresponding?: boolean
  isJointContributor?: boolean
  phoneNumber?: string
  priority: number
  researchFields?: string[] // MPResearchField IDs
  role: ContributorRole
  url?: string
  image?: string
}

export interface Affiliation extends Component {
  name: string
  address?: string
  city?: string
  institution?: string
}

export interface Grant extends Component {
  organization: string
  code: string
  title: string
  fundingBody: string
}

export interface Group extends Component {
  name: string
  description: string
}

export interface Section extends Component {
  priority: number
  title: string
  path: string[]
  elementIDs: string[]
}

export interface Table extends Component {
  // caption: string
  contents: string
}

export interface Figure extends Component {
  contentType: string
  src?: string
  attachment?: Attachment
  originalURL?: string
  title?: string // TODO: make this editable
}

type Year = string | number
type Month = string | number
type Day = string | number

type DatePart = [Year, Month, Day]

export interface AuxiliaryObjectReference extends Component {
  containingObject: string
  referencedObject: string
  auxiliaryObjectReferenceStyle?: string
}

export interface BibliographicDate extends Component {
  'date-parts': [DatePart] | [DatePart, DatePart]
}

export interface BibliographyItem extends Component {
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

export interface Citation extends Component {
  containingElement: string
  embeddedCitationItems: CitationItem[]
  collationType?: number
  citationStyle?: string
}

export interface CitationItem extends Component {
  bibliographyItem: string
}

export interface Element extends Component {
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

export type AnyElement =
  | BibliographyElement
  | EquationElement
  | FigureElement
  | ListingElement
  | OrderedListElement
  | ParagraphElement
  | TableElement
  | UnorderedListElement

export type AnyComponent =
  | Manuscript
  | BibliographicName
  | BibliographyItem
  | BibliographicDate
  | Citation
  | Contributor
  | Affiliation
  | Group
  | Section
  | Table
  | Figure
  | AnyElement

interface Attachments {
  _attachments: Array<RxAttachment<AnyComponent>>
}

interface ComponentAttachment {
  attachment?: RxAttachmentCreator
  src?: string
}

export type PrioritizedComponent = Section | Figure

export type ComponentIdSet = Set<string>

export type ComponentDocument = RxDocument<AnyComponent> & Attachments

export type ComponentMap = Map<string, AnyComponent>

export type ComponentCollection = RxCollection<AnyComponent>

export type ComponentWithAttachment = AnyComponent & ComponentAttachment

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
