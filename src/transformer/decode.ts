import {
  DOMParser,
  Node as ProsemirrorNode,
  ParseOptions,
} from 'prosemirror-model'
import { RxDocument } from 'rxdb'
import schema from '../editor/config/schema'
import {
  Attachments,
  BibliographyElement,
  Element,
  Equation,
  EquationElement,
  Figure,
  FigureElement,
  List,
  Listing,
  ListingElement,
  Model,
  ModelAttachment,
  Paragraph,
  PlaceholderElement,
  Section,
  Table,
  TableElement,
  TOCElement,
  UserProfile,
} from '../types/models'
import { generateID } from './id'
import * as ObjectTypes from './object-types'

const parser = DOMParser.fromSchema(schema)

type NodeCreator = (model: Model) => ProsemirrorNode

interface NodeCreatorMap {
  [key: string]: NodeCreator
}

export const getModelData = (model: Model): Model => {
  const { _rev, _deleted, updatedAt, createdAt, sessionID, ...data } = model

  return data
}

export const getModelFromDoc = async <T extends Model>(
  doc: RxDocument<Model & Attachments>
): Promise<T & ModelAttachment> => {
  const data = getModelData(doc.toJSON())

  // TODO: provide a method for loading attachments from a doc id, instead of this?
  if (doc._attachments) {
    const attachments = await doc.allAttachments()
    const blob = await attachments[0].getData()
    const url = window.URL.createObjectURL(blob)

    switch (data.objectType) {
      case ObjectTypes.USER_PROFILE:
        ;(data as UserProfile).image = url
        break

      case ObjectTypes.FIGURE:
      default:
        ;(data as Figure).src = url
        break
    }
  }

  return data as T & ModelAttachment
}

export const parseContents = (contents: string, options?: ParseOptions) => {
  const fragment = document.createRange().createContextualFragment(contents)

  return parser.parse(fragment.firstChild as Node, options)
}

export const buildModelMap = (
  docs: Array<RxDocument<Model>>
): Promise<Map<string, Model>> => {
  const output = new Map()

  const promises = docs.map(async doc => {
    const data = await getModelFromDoc(doc as RxDocument<Model & Attachments>)
    output.set(doc._id, data)
  })

  return Promise.all(promises).then(() => output)
}

export const getModelsByType = <T extends Model>(
  modelMap: Map<string, Model>,
  objectType: string
): T[] => {
  const output: T[] = []

  for (const model of modelMap.values()) {
    if (model.objectType === objectType) {
      output.push(model as T)
    }
  }

  return output
}

export const sortSectionsByPriority = (a: Section, b: Section) =>
  a.priority === b.priority ? 0 : Number(a.priority) - Number(b.priority)

// TODO: include bibliography and toc sections
export const getSections = (modelMap: Map<string, Model>) =>
  getModelsByType<Section>(modelMap, ObjectTypes.SECTION).sort(
    sortSectionsByPriority
  )

export class Decoder {
  private readonly modelMap: Map<string, Model>

  private creators: NodeCreatorMap = {
    [ObjectTypes.BIBLIOGRAPHY_ELEMENT]: (model: BibliographyElement) => {
      return schema.nodes.bibliography_element.create({
        id: model._id,
        contents: model.contents
          ? model.contents.replace(/\s+xmlns=".+?"/, '')
          : '',
      })
    },
    [ObjectTypes.PLACEHOLDER_ELEMENT]: (model: PlaceholderElement) => {
      return schema.nodes.placeholder_element.create({
        id: model._id,
      })
    },
    [ObjectTypes.FIGURE_ELEMENT]: (model: FigureElement) => {
      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = model.caption
        ? parseContents(`<figcaption>${model.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      // TODO: actual figure nodes in here?

      return schema.nodes.figure_element.createChecked(
        {
          id: model._id,
          containedObjectIDs: model.containedObjectIDs,
          figureStyle: model.figureStyle,
          suppressCaption: Boolean(model.suppressCaption),
        },
        figcaption
      )
    },
    [ObjectTypes.EQUATION_ELEMENT]: (model: EquationElement) => {
      const equationModel = this.getModel<Equation>(model.containedObjectID)

      const equation = equationModel
        ? schema.nodes.equation.create({
            id: equationModel._id,
            SVGStringRepresentation: equationModel.SVGStringRepresentation,
            TeXRepresentation: equationModel.TeXRepresentation,
          })
        : schema.nodes.placeholder.create({
            id: model.containedObjectID,
            label: 'An equation',
          })

      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = model.caption
        ? parseContents(`<figcaption>${model.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.equation_element.createChecked(
        {
          id: model._id,
          suppressCaption: model.suppressCaption,
        },
        [equation, figcaption]
      )
    },
    [ObjectTypes.FOOTNOTES_ELEMENT]: (model: TOCElement) => {
      return schema.nodes.footnotes_element.create({
        id: model._id,
        contents: model.contents,
      })
    },
    [ObjectTypes.LIST_ELEMENT]: (model: List) => {
      switch (model.elementType) {
        case 'ol':
          // TODO: wrap inline text in paragraphs
          return parseContents(model.contents || '<ol></ol>', {
            topNode: schema.nodes.ordered_list.create({
              id: model._id,
              paragraphStyle: model.paragraphStyle,
            }),
          })

        case 'ul':
          // TODO: wrap inline text in paragraphs
          return parseContents(model.contents || '<ul></ul>', {
            topNode: schema.nodes.bullet_list.create({
              id: model._id,
              paragraphStyle: model.paragraphStyle,
            }),
          })

        default:
          throw new Error('Unknown list element type')
      }
    },
    [ObjectTypes.LISTING_ELEMENT]: (model: ListingElement) => {
      const listingModel = this.getModel<Listing>(model.containedObjectID)

      const listing = listingModel
        ? schema.nodes.listing.create({
            id: listingModel._id,
            contents: listingModel.contents,
            language: listingModel.language,
            languageKey: listingModel.languageKey,
          })
        : schema.nodes.placeholder.create({
            id: model.containedObjectID,
            label: 'A listing',
          })

      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = model.caption
        ? parseContents(`<figcaption>${model.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.listing_element.createChecked(
        {
          id: model._id,
          suppressCaption: model.suppressCaption,
        },
        [listing, figcaption]
      )
    },
    [ObjectTypes.PARAGRAPH]: (model: Paragraph) => {
      return parseContents(model.contents || '<p></p>', {
        topNode: schema.nodes.paragraph.create({
          id: model._id,
          paragraphStyle: model.paragraphStyle,
          placeholder: model.placeholderInnerHTML,
        }),
      })
    },
    [ObjectTypes.SECTION]: (model: Section) => {
      const elements: Element[] = []

      if (model.elementIDs) {
        for (const id of model.elementIDs) {
          const element = this.getModel<Element>(id)

          if (element) {
            elements.push(element)
          } else {
            const placeholderElement: PlaceholderElement = {
              _id: id,
              containerID: model._id,
              elementType: 'div',
              objectType: ObjectTypes.PLACEHOLDER_ELEMENT,
            }

            elements.push(placeholderElement)
          }
        }
      }

      const elementNodes = elements.map(this.decode)

      const sectionTitleNode = model.title
        ? parseContents(`<h1>${model.title}</h1>`, {
            topNode: schema.nodes.section_title.create(),
          })
        : schema.nodes.section_title.create()

      const nestedSections = getSections(this.modelMap)
        .filter(section => section.path.length > 1)
        .filter(item => item.path[item.path.length - 2] === model._id)
        .map(this.creators[ObjectTypes.SECTION])

      const sectionNodeType = this.chooseSectionNodeType(elements)

      const sectionNode = sectionNodeType.createAndFill(
        {
          id: model._id,
          titleSuppressed: model.titleSuppressed,
        },
        [sectionTitleNode].concat(elementNodes).concat(nestedSections)
      )

      if (!sectionNode) {
        console.error(model) // tslint:disable-line:no-console
        throw new Error('Invalid content for section ' + model._id)
      }

      return sectionNode
    },
    [ObjectTypes.TABLE_ELEMENT]: (model: TableElement) => {
      const tableModel = this.getModel<Table>(model.containedObjectID)

      const table = tableModel
        ? parseContents(tableModel.contents, {
            topNode: schema.nodes.table.create({
              id: tableModel._id,
            }),
          })
        : schema.nodes.placeholder.create({
            id: model.containedObjectID,
            label: 'A table',
          })

      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = model.caption
        ? parseContents(`<figcaption>${model.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.table_element.createChecked(
        {
          id: model._id,
          table: model.containedObjectID,
          suppressCaption: model.suppressCaption,
          suppressFooter: model.suppressFooter,
          suppressHeader: model.suppressHeader,
          tableStyle: model.tableStyle,
          paragraphStyle: model.paragraphStyle,
        },
        [table, figcaption]
      )
    },
    [ObjectTypes.TOC_ELEMENT]: (model: TOCElement) => {
      return schema.nodes.toc_element.create({
        id: model._id,
        contents: model.contents,
      })
    },
  }

  constructor(modelMap: Map<string, Model>) {
    this.modelMap = modelMap
  }

  public decode = (model: Model) => {
    if (!this.creators[model.objectType]) {
      throw new Error('No converter for ' + model.objectType)
    }

    return this.creators[model.objectType](model)
  }

  public getModel = <T extends Model>(id: string): T | undefined =>
    this.modelMap.get(id) as T | undefined

  public createArticleNode = () => {
    const rootSections = getSections(this.modelMap).filter(
      section => section.path.length <= 1
    )

    const rootSectionNodes = rootSections.map(this.decode)

    if (!rootSectionNodes.length) {
      rootSectionNodes.push(schema.nodes.section.createAndFill({
        id: generateID('section'),
      }) as ProsemirrorNode)
    }

    return schema.nodes.manuscript.create({}, rootSectionNodes)
  }

  private chooseSectionNodeType = (elements: Model[]) => {
    if (!elements.length) return schema.nodes.section

    switch (elements[0].objectType) {
      case ObjectTypes.BIBLIOGRAPHY_ELEMENT:
        return schema.nodes.bibliography_section

      case ObjectTypes.TOC_ELEMENT:
        return schema.nodes.toc_section

      default:
        return schema.nodes.section
    }
  }
}
