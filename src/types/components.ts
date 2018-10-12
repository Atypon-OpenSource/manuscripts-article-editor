import {
  RxAttachment,
  RxAttachmentCreator,
  RxCollection,
  RxDocument,
} from 'rxdb'

export interface Attachment {
  id: string
  data: Blob | ArrayBuffer
  type: string
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

export interface ProjectInvitation extends Component {
  invitedUserEmail: string
  invitingUserID: string
  projectID: string
  message: string
  role: string
  projectTitle?: string
  invitedUserName?: string
  acceptedAt?: number
}

export interface Manuscript extends ContainedComponent {
  title: string
  data?: string
  bundle: string
  primaryLanguageCode?: string
}

export interface BibliographicName extends EmbeddedComponent {
  given?: string
  family?: string
  droppingParticle?: string
  nonDroppingParticle?: string
  suffix?: string
  literal?: string
}

export interface ProjectInvitation extends Component {
  invitedUserEmail: string
  invitingUserID: string
  projectID: string
  message: string
  role: string
  projectTitle?: string
  invitedUserName?: string
  acceptedAt?: number
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
  userID?: string | null
  invitationID?: string
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
  titleSuppressed?: boolean
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

export interface Equation extends ContainedComponent {
  TeXRepresentation: string
  SVGStringRepresentation?: string
  MathMLStringRepresentation?: string
  OMMLStringRepresentation?: string
}

export interface Footnote extends ContainedComponent {
  containingObject: string
  contents: string
}

export interface Listing extends ContainedComponent {
  contents: string
  language: string
  languageKey: string
}

export interface InlineMathFragment extends ContainedComponent {
  containingObject: string
  TeXRepresentation: string
  SVGRepresentation?: string
  SVGGlyphs?: string
  MathMLRepresentation?: string
  OMMLRepresentation?: string
}

export interface Element extends ContainedComponent {
  elementType: string
  placeholderInnerHTML?: string
}

export interface Paragraph extends Element {
  elementType: 'p'
  contents: string
  paragraphStyle: string
}

export interface List extends Element {
  elementType: 'ul' | 'ol'
  contents: string
  paragraphStyle: string
}

export interface EquationElement extends Element {
  caption: string
  containedObjectID: string
  suppressCaption?: boolean
}

export interface FigureElement extends Element {
  elementType: 'figure'
  caption: string
  containedObjectIDs: string[]
  figureLayout: string
  figureStyle: string
  suppressCaption?: boolean
}

export interface FootnotesElement extends Element {
  collateByKind?: string
  contents: string
}

export interface ListingElement extends Element {
  elementType: 'figure'
  caption: string
  containedObjectID: string
  suppressCaption?: boolean
}

export interface TOCElement extends Element {
  contents: string
}

export interface TableElement extends Element {
  elementType: 'table'
  caption: string
  containedObjectID: string
  paragraphStyle?: string
  suppressCaption?: boolean
  suppressFooter?: boolean
  suppressHeader?: boolean
  tableStyle?: string
}

export interface BibliographyElement extends Element {
  elementType: 'div' | 'p' | 'table' // TODO: must be 'p' or 'table'?!
  contents: string
}

export interface PlaceholderElement extends Element {
  elementType: 'div'
}

export interface Bundle extends Component {
  _id: string
  csl?: {
    'author-name'?: string
    'author-email'?: string
    version?: string
    defaultLocale?: string
    title?: string
    cslIdentifier?: string
    'self-URL'?: string
    'independent-parent-URL'?: string
    'documentation-URL'?: string
    fields?: string[]
    ISSNs?: string[]
    eISSNs?: string[]
    updatedAt?: number
    license?: string
    _id?: string
  }
  scimago?: {
    t?: string
    I?: string
    R?: number
    H?: number
    dY?: number
    d3Y?: number
    rY?: number
    c3Y?: number
    cib3Y?: number
    muC2Y?: number
    muR?: number
    c?: string
  }
}

export interface CommentSelector {
  from: number
  to: number
  text: string
}

export interface CommentAnnotation extends ManuscriptComponent {
  contents: string
  selector?: CommentSelector
  target: string
  userID: string
}

export type AnyStyle = BorderStyle | FigureStyle

export type AnyElement =
  | BibliographyElement
  | EquationElement
  | FigureElement
  | FootnotesElement
  | ListingElement
  | List
  | Paragraph
  | TableElement
  | TOCElement

export type AnySharedComponent = AnyStyle | Border

export type AnyManuscriptComponent =
  | AnyElement
  | Affiliation
  | Contributor
  | Grant

export type AnyContainedComponent =
  | AnyManuscriptComponent
  | AuxiliaryObjectReference
  | BibliographyItem
  | Citation
  | Equation
  | Figure
  | InlineMathFragment
  | Keyword
  | Manuscript
  | Section
  | Table

export type AnyComponent = AnySharedComponent | AnyContainedComponent

export interface Attachments {
  _attachments: Array<RxAttachment<AnyComponent>>
}

export interface ComponentAttachment {
  attachment?: RxAttachmentCreator
  src?: string
}

export type ComponentIdSet = Set<string>

export type ComponentDocument = RxDocument<AnyContainedComponent & Attachments>

export type ComponentWithAttachment = AnyComponent & ComponentAttachment

export type ComponentMap = Map<string, ComponentWithAttachment>

export type ComponentCollection = RxCollection<AnyComponent>
