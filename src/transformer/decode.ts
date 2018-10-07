import {
  DOMParser,
  Node as ProsemirrorNode,
  ParseOptions,
} from 'prosemirror-model'
import { RxDocument } from 'rxdb'
import schema from '../editor/config/schema'
import {
  AnyComponent,
  Attachments,
  BibliographyElement,
  Component,
  ComponentAttachment,
  ComponentDocument,
  ComponentMap,
  Equation,
  EquationElement,
  Figure,
  FigureElement,
  List,
  Listing,
  ListingElement,
  Paragraph,
  Section,
  Table,
  TableElement,
  TOCElement,
  UserProfile,
} from '../types/components'
import * as ObjectTypes from './object-types'

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

// TODO: include bibliography and toc sections
export const getSections = (componentMap: ComponentMap) =>
  getComponentsByType<Section>(componentMap, ObjectTypes.SECTION).sort(
    sortSectionsByPriority
  )

export class Decoder {
  private readonly componentMap: ComponentMap

  private creators: NodeCreatorMap = {
    [ObjectTypes.BIBLIOGRAPHY_ELEMENT]: (component: BibliographyElement) => {
      return schema.nodes.bibliography_element.create({
        id: component.id,
        contents: component.contents.replace(/\s+xmlns=".+?"/, ''),
      })
    },
    [ObjectTypes.FIGURE_ELEMENT]: (component: FigureElement) => {
      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = component.caption
        ? parseContents(`<figcaption>${component.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      // TODO: actual figure nodes in here?

      return schema.nodes.figure_element.createChecked(
        {
          id: component.id,
          containedObjectIDs: component.containedObjectIDs,
          figureStyle: component.figureStyle,
          suppressCaption: Boolean(component.suppressCaption),
        },
        figcaption
      )
    },
    [ObjectTypes.EQUATION_ELEMENT]: (component: EquationElement) => {
      const equationComponent = this.getComponent<Equation>(
        component.containedObjectID
      )

      const equation = schema.nodes.equation.create({
        id: equationComponent.id,
        SVGStringRepresentation: equationComponent.SVGStringRepresentation,
        TeXRepresentation: equationComponent.TeXRepresentation,
      })

      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = component.caption
        ? parseContents(`<figcaption>${component.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.equation_element.createChecked(
        {
          id: component.id,
          suppressCaption: component.suppressCaption,
        },
        [equation, figcaption]
      )
    },
    [ObjectTypes.FOOTNOTES_ELEMENT]: (component: TOCElement) => {
      return schema.nodes.footnotes_element.create({
        id: component.id,
        contents: component.contents,
      })
    },
    [ObjectTypes.LIST_ELEMENT]: (component: List) => {
      switch (component.elementType) {
        case 'ol':
          // TODO: wrap inline text in paragraphs
          return parseContents(component.contents, {
            topNode: schema.nodes.ordered_list.create({
              id: component.id,
              paragraphStyle: component.paragraphStyle,
            }),
          })

        case 'ul':
          // TODO: wrap inline text in paragraphs
          return parseContents(component.contents, {
            topNode: schema.nodes.bullet_list.create({
              id: component.id,
              paragraphStyle: component.paragraphStyle,
            }),
          })

        default:
          throw new Error('Unknown list element type')
      }
    },
    [ObjectTypes.LISTING_ELEMENT]: (component: ListingElement) => {
      const listingComponent = this.getComponent<Listing>(
        component.containedObjectID
      )

      const listing = schema.nodes.listing.create({
        id: listingComponent.id,
        contents: listingComponent.contents,
        language: listingComponent.language,
        languageKey: listingComponent.languageKey,
      })

      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = component.caption
        ? parseContents(`<figcaption>${component.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.listing_element.createChecked(
        {
          id: component.id,
          suppressCaption: component.suppressCaption,
        },
        [listing, figcaption]
      )
    },
    [ObjectTypes.PARAGRAPH]: (component: Paragraph) => {
      return parseContents(component.contents, {
        topNode: schema.nodes.paragraph.create({
          id: component.id,
          paragraphStyle: component.paragraphStyle,
          placeholder: component.placeholderInnerHTML,
        }),
      })
    },
    [ObjectTypes.SECTION]: (component: Section) => {
      const elements: Component[] = []

      if (component.elementIDs) {
        for (const id of component.elementIDs) {
          // try {
          elements.push(this.getComponent(id))
          // } catch (e) {
          // TODO: create a placeholder element if a component isn't found
          //   console.error(e) // tslint:disable-line:no-console
          // }
        }
      }

      const elementNodes = elements.map(this.decode)

      const sectionTitleNode = component.title
        ? parseContents(`<h1>${component.title}</h1>`, {
            topNode: schema.nodes.section_title.create(),
          })
        : schema.nodes.section_title.create()

      const nestedSections = getSections(this.componentMap)
        .filter(section => section.path.length > 1)
        .filter(item => item.path[item.path.length - 2] === component.id)
        .map(this.creators[ObjectTypes.SECTION])

      const sectionNodeType = this.chooseSectionNodeType(elements)

      const sectionNode = sectionNodeType.createAndFill(
        {
          id: component.id,
          titleSuppressed: component.titleSuppressed,
        },
        [sectionTitleNode].concat(elementNodes).concat(nestedSections)
      )

      if (!sectionNode) {
        console.error(component) // tslint:disable-line:no-console
        throw new Error('Invalid content for section ' + component.id)
      }

      return sectionNode
    },
    [ObjectTypes.TABLE_ELEMENT]: (component: TableElement) => {
      const tableComponent = this.getComponent<Table>(
        component.containedObjectID
      )

      const table = parseContents(tableComponent.contents, {
        topNode: schema.nodes.table.create({
          id: tableComponent.id,
        }),
      })

      const figcaptionNode = schema.nodes.figcaption.create()

      const figcaption = component.caption
        ? parseContents(`<figcaption>${component.caption}</figcaption>`, {
            topNode: figcaptionNode,
          })
        : figcaptionNode

      return schema.nodes.table_element.createChecked(
        {
          id: component.id,
          table: component.containedObjectID,
          suppressCaption: component.suppressCaption,
          suppressFooter: component.suppressFooter,
          suppressHeader: component.suppressHeader,
          tableStyle: component.tableStyle,
          paragraphStyle: component.paragraphStyle,
        },
        [table, figcaption]
      )
    },
    [ObjectTypes.TOC_ELEMENT]: (component: TOCElement) => {
      return schema.nodes.toc_element.create({
        id: component.id,
        contents: component.contents,
      })
    },
  }

  constructor(componentMap: ComponentMap) {
    this.componentMap = componentMap
  }

  public decode = (component: Component) => {
    if (!this.creators[component.objectType]) {
      throw new Error('No converter for ' + component.objectType)
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

    const rootSectionNodes = rootSections.map(this.decode)

    if (!rootSectionNodes.length) {
      rootSectionNodes.push(
        schema.nodes.section.createAndFill() as ProsemirrorNode
      )
    }

    const node = schema.nodes.manuscript.create({}, rootSectionNodes)

    try {
      node.check()
    } catch (e) {
      console.error(e) // tslint:disable-line:no-console
      throw new Error('Unable to create article node')
    }

    return node
  }

  private chooseSectionNodeType = (elements: Component[]) => {
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
