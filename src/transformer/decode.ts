import {
  DOMParser,
  Node as ProsemirrorNode,
  ParseOptions,
} from 'prosemirror-model'
import { RxDocument } from 'rxdb'
import { options } from '../editor/config'
import {
  AnyComponent,
  Attachments,
  BibliographyElement,
  Component,
  ComponentAttachment,
  ComponentDocument,
  ComponentMap,
  EquationElement,
  Figure,
  FigureElement,
  ListingElement,
  OrderedListElement,
  ParagraphElement,
  Section,
  Table,
  TableElement,
  UnorderedListElement,
  UserProfile,
} from '../types/components'
import * as ObjectTypes from './object-types'

const { schema } = options

const parser = DOMParser.fromSchema(schema)

type NodeCreator = (component: Component) => ProsemirrorNode

interface NodeCreatorMap {
  [key: string]: NodeCreator
}

export const getComponentData = (component: Component): Component => {
  const { _rev, _deleted, updatedAt, createdAt, sessionID, ...data } = component

  return data
}

export const getComponentFromDoc = async <T extends Component>(
  doc: RxDocument<Component & Attachments>
): Promise<T & ComponentAttachment> => {
  const data = getComponentData(doc.toJSON())

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

  return data as T & ComponentAttachment
}

export const parseContents = (contents: string, options?: ParseOptions) => {
  const fragment = document.createRange().createContextualFragment(contents)

  return parser.parse(fragment.firstChild as Node, options)
}

export const buildComponentMap = (
  docs: ComponentDocument[]
): Promise<ComponentMap> => {
  const output = new Map()

  const promises = docs.map(async doc => {
    const data = await getComponentFromDoc(doc)
    output.set(doc.id, data)
  })

  return Promise.all(promises).then(() => output)
}

export const getComponentsByType = <T extends AnyComponent>(
  componentMap: ComponentMap,
  objectType: string
): T[] => {
  const output: T[] = []

  for (const component of componentMap.values()) {
    if (component.objectType === objectType) {
      output.push(component as T)
    }
  }

  return output
}

export const sortSectionsByPriority = (a: Section, b: Section) =>
  a.priority === b.priority ? 0 : a.priority - b.priority

export const getSections = (componentMap: ComponentMap) =>
  getComponentsByType<Section>(componentMap, ObjectTypes.SECTION).sort(
    sortSectionsByPriority
  )

export class Decoder {
  private readonly componentMap: ComponentMap

  private creators: NodeCreatorMap = {
    [ObjectTypes.PARAGRAPH_ELEMENT]: (component: ParagraphElement) => {
      return parseContents(component.contents, {
        topNode: schema.nodes.paragraph.create({
          id: component.id,
          placeholder: component.placeholderInnerHTML,
        }),
      })
    },
    [ObjectTypes.LIST_ELEMENT]: (
      component: OrderedListElement | UnorderedListElement
    ) => {
      switch (component.elementType) {
        case 'ol':
          // TODO: wrap inline text in paragraphs
          return parseContents(component.contents, {
            topNode: schema.nodes.ordered_list.create({
              id: component.id,
            }),
          })

        case 'ul':
          // TODO: wrap inline text in paragraphs
          return parseContents(component.contents, {
            topNode: schema.nodes.bullet_list.create({
              id: component.id,
            }),
          })

        default:
          throw new Error('Unknown list element type')
      }
    },
    [ObjectTypes.FIGURE_ELEMENT]: (component: FigureElement) => {
      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = component.caption
        ? parseContents(`<figcaption>${component.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.figure.createChecked(
        {
          id: component.id,
          containedObjectIDs: component.containedObjectIDs,
          figureStyle: component.figureStyle,
          suppressCaption: Boolean(component.suppressCaption),
        },
        figcaption
      )
    },
    [ObjectTypes.TABLE_ELEMENT]: (component: TableElement) => {
      const tableComponent = this.getComponent<Table>(
        component.containedObjectID
      )

      const table = parseContents(tableComponent.contents, {
        topNode: schema.nodes.table.create(),
      })

      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = component.caption
        ? parseContents(`<figcaption>${component.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.table_figure.createChecked(
        {
          id: component.id,
          table: component.containedObjectID,
          suppressFooter: component.suppressFooter,
          suppressHeader: component.suppressHeader,
        },
        [table, figcaption]
      )
    },
    [ObjectTypes.BIBLIOGRAPHY_ELEMENT]: (component: BibliographyElement) => {
      return schema.nodes.bibliography.create({
        id: component.id,
        contents: component.contents,
      })
    },
    [ObjectTypes.EQUATION_ELEMENT]: (component: EquationElement) => {
      return schema.nodes.equation_block.create({
        id: component.id,
        latex: component.TeXRepresentation,
      })
    },
    [ObjectTypes.LISTING_ELEMENT]: (component: ListingElement) => {
      return schema.nodes.code_block.create({
        id: component.id,
        code: component.contents,
        language: component.languageKey,
      })
    },
    [ObjectTypes.SECTION]: (component: Section) => {
      const components: AnyComponent[] = (component.elementIDs || [])
        .filter(id => id) // TODO: remove once no empty items in the array
        .map(this.getComponent)

      const elements = components.map(this.decode) as ProsemirrorNode[]

      const sectionTitleNode = component.title
        ? parseContents(`<h1>${component.title}</h1>`, {
            topNode: schema.nodes.section_title.create(),
          })
        : schema.nodes.section_title.create()

      const nestedSections = getSections(this.componentMap)
        .filter(section => section.path.length > 1)
        .filter(item => item.path[item.path.length - 2] === component.id)
        .map(this.creators[ObjectTypes.SECTION])

      const nodeType =
        components.length &&
        components[0].objectType === ObjectTypes.BIBLIOGRAPHY_ELEMENT
          ? schema.nodes.bibliography_section
          : schema.nodes.section

      const sectionNode = nodeType.createAndFill(
        {
          id: component.id,
          priority: component.priority,
        },
        [sectionTitleNode].concat(elements).concat(nestedSections)
      )

      if (!sectionNode) {
        console.error(component) // tslint:disable-line:no-console
        throw new Error('Invalid content for section ' + component.id)
      }

      return sectionNode
    },
  }

  constructor(componentMap: ComponentMap) {
    this.componentMap = componentMap
  }

  public decode = (component: Component) => {
    if (!this.creators[component.objectType]) {
      console.debug('No converter for ' + component.objectType) // tslint:disable-line:no-console
      return null
    }

    return this.creators[component.objectType](component)
  }

  public getComponent = <T extends AnyComponent>(id: string): T => {
    if (!this.componentMap.has(id)) {
      throw new Error('Element not found: ' + id)
    }

    return this.componentMap.get(id) as T
  }

  public createArticleNode = () => {
    const rootSections = getSections(this.componentMap).filter(
      section => section.path.length <= 1
    )

    const rootSectionNodes = rootSections.map(this.decode) as ProsemirrorNode[]

    if (!rootSectionNodes.length) {
      rootSectionNodes.push(
        schema.nodes.section.createAndFill() as ProsemirrorNode
      )
    }

    const node = schema.nodes.article.create({}, rootSectionNodes)

    try {
      node.check()
    } catch (e) {
      console.error(e) // tslint:disable-line:no-console
      throw new Error('Unable to create article node')
    }

    return node
  }
}
