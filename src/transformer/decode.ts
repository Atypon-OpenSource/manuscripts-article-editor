import {
  DOMParser,
  Node as ProsemirrorNode,
  ParseOptions,
} from 'prosemirror-model'
import { options } from '../editor/config'
import {
  AnyComponent,
  BibliographyElement,
  Component,
  ComponentDocument,
  ComponentMap,
  EquationElement,
  Figure,
  FigureElement,
  ListingElement,
  Manuscript,
  OrderedListElement,
  ParagraphElement,
  Section,
  Table,
  TableElement,
  UnorderedListElement,
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

export const getComponentFromDoc = async (doc: ComponentDocument) => {
  const data = getComponentData(doc.toJSON())

  if (doc._attachments) {
    const attachments = await doc.allAttachments()
    const blob = await attachments[0].getData()
    ;(data as Figure).src = window.URL.createObjectURL(blob)
  }

  return data
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

const sortSectionsByPriority = (a: Section, b: Section) =>
  a.priority === b.priority ? 0 : a.priority - b.priority

export const getSections = (componentMap: ComponentMap) =>
  getComponentsByType<Section>(componentMap, ObjectTypes.SECTION).sort(
    sortSectionsByPriority
  )

export class Decoder {
  private readonly componentMap: ComponentMap

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
    const manuscripts = getComponentsByType<Manuscript>(
      this.componentMap,
      ObjectTypes.MANUSCRIPT
    )

    if (!manuscripts.length) {
      throw new Error('Manuscript not found')
    }

    const manuscript = manuscripts[0]

    const rootSections = getSections(this.componentMap).filter(
      section => section.path.length <= 1
    )

    const articleNode = schema.nodes.article.createAndFill({}, [
      this.decode(manuscript) as ProsemirrorNode,
      ...(rootSections.map(this.decode) as ProsemirrorNode[]),
      // this.createBibliographySectionNode(), // TODO:
    ])

    if (!articleNode) {
      throw new Error('Unable to create article node')
    }

    return articleNode
  }

  // private createBibliographySectionNode = () => {
  //   const bibliographyNode = schema.nodes.bibliography.create({
  //     id: generateID('bibliography'),
  //   })
  //
  //   const bibliographyTitleNode = schema.nodes.section_title.createChecked(
  //     {},
  //     schema.text('Bibliography')
  //   )
  //
  //   return schema.nodes.bibliography_section.createChecked(
  //     {
  //       id: generateID('section'),
  //     },
  //     [bibliographyTitleNode, bibliographyNode]
  //   )
  // }

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
        },
        figcaption
      )
    },
    [ObjectTypes.TABLE_ELEMENT]: (component: TableElement) => {
      let table

      // TODO: find out why the table component is getting lost
      try {
        const tableComponent = this.getComponent<Table>(
          component.containedObjectID
        )

        table =
          tableComponent && tableComponent.contents
            ? parseContents(tableComponent.contents, {
                topNode: schema.nodes.table.create(),
              })
            : (schema.nodes.table.createAndFill() as ProsemirrorNode)
      } catch (e) {
        table = schema.nodes.table.createAndFill() as ProsemirrorNode
      }

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
      const elements = (component.elementIDs || [])
        .filter(id => id) // TODO: remove once no empty items in the array
        .map(this.getComponent)
        .map(this.decode) as ProsemirrorNode[]

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
        elements.length && elements[0].type.name === 'bibliography'
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
        console.error(component) // tslint:disable-line
        throw new Error('Invalid content for section ' + component.id)
      }

      return sectionNode
    },
    [ObjectTypes.MANUSCRIPT]: (component: Manuscript) => {
      const titleNode = component.title
        ? parseContents(`<h1>${component.title}</h1>`, {
            topNode: schema.nodes.title.create(),
          })
        : schema.nodes.title.create()

      return schema.nodes.manuscript.createAndFill(
        {
          id: component.id,
          citationStyle: component.citationStyle,
          locale: component.locale,
        },
        titleNode
      ) as ProsemirrorNode
    },
    // TODO: bibliography section?
  }
}
