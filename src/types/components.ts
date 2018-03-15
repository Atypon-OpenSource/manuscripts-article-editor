// import * as ObjectTypes from '../editor/transformer/object-types'

export interface Component {
  // _id: string
  id: string
  objectType: string
  createdAt?: number
  updatedAt?: number
  manuscript?: string
}

export interface Manuscript extends Component {
  title: string
  data?: string
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
  originalURL: string
  contentType: string
}

export interface Element extends Component {
  elementType: string
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
  | TableElement
  | BibliographyElement

export type AnyComponent =
  | Manuscript
  | BibliographicName
  | Contributor
  | Affiliation
  | Person
  | Collaborator
  | Group
  | Section
  | Table
  | Figure
  | AnyElement
