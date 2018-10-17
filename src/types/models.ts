import { RxAttachment, RxAttachmentCreator } from 'rxdb'

export * from '@manuscripts/manuscripts-json-schema'

import * as Models from '@manuscripts/manuscripts-json-schema'

export interface Model extends Models.Model {
  _deleted?: boolean
  objectType: string
}

export interface Attachment {
  id: string
  data: Blob | ArrayBuffer
  type: string
}

export interface Attachments {
  _attachments: Array<RxAttachment<Model>>
}

export interface ModelAttachment {
  attachment?: RxAttachmentCreator
  src?: string
}

export type ModelWithAttachment = Model & ModelAttachment

export interface UserProfile extends Models.UserProfile {
  avatar?: string
  image?: string
}

export interface Contributor extends Models.Contributor {
  profileID?: string
}

export interface Keyword extends Models.Keyword {
  containerID: string
}

export interface ContainedProps {
  containerID: string
}

export interface ManuscriptProps {
  manuscriptID: string
}

export type ContainedModel = Model & ContainedProps
export type ManuscriptModel = ContainedModel & ManuscriptProps

export interface AuxiliaryObjectReference extends ContainedModel {
  containingObject: string
  referencedObject: string
  auxiliaryObjectReferenceStyle?: string
}

export interface CommentSelector {
  from: number
  to: number
  text: string
}

export interface CommentAnnotation extends ManuscriptModel {
  contents: string
  selector?: CommentSelector
  target: string
  userID: string
}

export type ContributorRole = 'author'

export interface Figure extends ContainedModel {
  contentType: string
  src?: string
  attachment?: Attachment
  originalURL?: string
  title?: string // TODO: make this editable
}

export interface Footnote extends ContainedModel {
  containingObject: string
  contents: string
}

export interface InlineMathFragment extends ContainedModel {
  containingObject: string
  TeXRepresentation: string
  SVGRepresentation?: string
  SVGGlyphs?: string
  MathMLRepresentation?: string
  OMMLRepresentation?: string
}

export interface BibliographyItem extends Models.BibliographyItem {
  [key: string]: any // tslint:disable-line:no-any
}

export interface Element extends ContainedModel {
  elementType: string
  // placeholderInnerHTML?: string
}

export interface PlaceholderElement extends Element {
  elementType: 'div'
}

export interface TableElement extends Models.TableElement {
  containedObjectID: string
}

export interface EquationElement extends Element {
  caption: string
  containedObjectID: string
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

export type List = Models.ListElement
export type Paragraph = Models.ParagraphElement

export interface Table extends ContainedModel {
  contents: string
}

export interface Equation extends ContainedModel {
  TeXRepresentation: string
  SVGStringRepresentation?: string
  MathMLStringRepresentation?: string
  OMMLStringRepresentation?: string
}

export interface Listing extends ContainedModel {
  contents: string
  language: string
  languageKey: string
}
