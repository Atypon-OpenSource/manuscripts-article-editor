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

export interface Manuscript extends Component {
  title: string
  data?: string
  owners?: string[]
}

export interface BibliographicName extends Component {
  given: string
  family: string
}

export interface Contributor extends Component {
  lastName: string
  firstName: string
  bibliographicName: BibliographicName
}

export interface Affiliation extends Component {
  name: string
  address?: string
}

export interface Person extends Component {
  name: string
  surname: string
  email?: string
  tel?: string
  image?: string
  affiliations?: Affiliation[]
}

export type Collaborator = Person // TODO

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
  | ParagraphElement
  | FigureElement
  | ListingElement
  | TableElement
  | BibliographyElement
  | EquationElement

export type AnyComponent =
  | Manuscript
  | BibliographicName
  | BibliographyItem
  | BibliographicDate
  | Citation
  | Contributor
  | Affiliation
  | Person
  | Collaborator
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
