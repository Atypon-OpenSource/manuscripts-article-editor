import {
  DOMParser,
  Node as ProsemirrorNode,
  ParseOptions,
} from 'prosemirror-model'
import { options } from '../editor/config'
import {
  BibliographyElement,
  Component,
  Element,
  Figure,
  FigureElement,
  Manuscript,
  ParagraphElement,
  Section,
  Table,
  TableElement,
} from '../types/components'
import { generateID } from './id'
import * as ObjectTypes from './object-types'

const { schema } = options

const parser = DOMParser.fromSchema(schema)

type NodeCreator = (element: Element) => ProsemirrorNode

interface NodeCreatorMap {
  [key: string]: NodeCreator
}

type ComponentMap = Map<string, Component>

const componentReducer = (output: ComponentMap, component: Component) => {
  output.set(component.id, component)
  return output
}

const objectTypeFilter = (type: string) => (component: Component) =>
  component.objectType === type

const sortSectionsByPriority = (a: Section, b: Section) =>
  a.priority === b.priority ? 0 : a.priority - b.priority

const parseContents = (contents: string, options: ParseOptions) => {
  const fragment = document.createRange().createContextualFragment(contents)

  return parser.parse(fragment, options)
}

export const decode = (components: Component[]): ProsemirrorNode => {
  const componentMap = components.reduce(componentReducer, new Map())

  const sections = components
    .filter(objectTypeFilter(ObjectTypes.SECTION))
    .sort(sortSectionsByPriority) as Section[]

  const rootSections = sections.filter(section => section.path.length <= 1)

  const childSections = sections.filter(section => section.path.length > 1)

  const createElement: NodeCreatorMap = {
    [ObjectTypes.PARAGRAPH_ELEMENT]: (element: ParagraphElement) => {
      return parseContents(element.contents, {
        topNode: schema.nodes.paragraph.createAndFill({
          id: element.id,
        }) as ProsemirrorNode,
      })
    },
    [ObjectTypes.FIGURE_ELEMENT]: (element: FigureElement) => {
      const containedObjectNodes = element.containedObjectIDs
        .map(id => componentMap.get(id))
        .filter(element => element && element.originalURL)
        .map((element: Figure) => {
          return schema.nodes.figimage.createChecked({
            src: element.originalURL,
          })
        })

      // TODO: content in captions?
      const figcaptionNode = schema.nodes.figcaption.createChecked(
        {},
        element.caption ? schema.text(element.caption) : undefined
      )

      return schema.nodes.figure.createChecked(
        {
          id: element.id,
        },
        // TODO: a block element for containing the image
        containedObjectNodes.concat(figcaptionNode)
      )
    },
    [ObjectTypes.TABLE_ELEMENT]: (element: TableElement) => {
      const table = componentMap.get(element.containedObjectID) as Table

      const figcaption = schema.nodes.figcaption.createChecked(
        {},
        element.caption ? schema.text(element.caption) : undefined
      )

      const tableNode = parseContents(table.contents, {
        topNode: schema.nodes.table.createAndFill({
          id: element.id,
        }) as ProsemirrorNode,
      })

      return schema.nodes.figure.createChecked(
        {
          id: element.id,
        },
        [tableNode, figcaption]
      )
    },
    [ObjectTypes.BIBLIOGRAPHY_ELEMENT]: (element: BibliographyElement) => {
      return parseContents(element.contents, {
        topNode: schema.nodes.bib.createAndFill({
          id: element.id,
        }) as ProsemirrorNode,
      })
    },
  }

  const createSection = (section: Section): ProsemirrorNode => {
    const elements = section.elementIDs
      .map(id => {
        if (!componentMap.has(id)) {
          throw new Error('Element not found: ' + id)
        }

        return componentMap.get(id) as Element
      })
      // .filter(element => element && element.objectType)
      .map(element => {
        if (!element.objectType) {
          throw new Error('Element has no objectType')
        }

        if (!createElement[element.objectType]) {
          throw new Error('Unknown objectType ' + element.objectType)
        }

        return createElement[element.objectType](element)
      })

    const nestedSections = childSections
      .filter(item => item.path[item.path.length - 2] === section.id)
      .map(createSection)

    if (!elements.length) {
      elements.push(schema.nodes.paragraph.create())
    }

    const sectionTitleNode = schema.nodes.section_title.createChecked(
      {},
      section.title ? schema.text(section.title) : undefined
    )

    const sectionNode = schema.nodes.section.createAndFill(
      {
        id: section.id,
        child: section.path.length > 1,
      },
      [sectionTitleNode].concat(elements).concat(nestedSections)
    )

    if (!sectionNode) {
      console.error(section) // tslint:disable-line
      throw new Error('Invalid content for section ' + section.id)
    }

    return sectionNode
  }

  const manuscripts = components.filter(
    objectTypeFilter(ObjectTypes.MANUSCRIPT)
  ) as Manuscript[]

  const manuscript = manuscripts[0]

  const buildExistingArticle = (manuscript: Manuscript) => {
    const titleNode = schema.nodes.title.createAndFill(
      {},
      manuscript.title ? schema.text(manuscript.title) : undefined
    ) as ProsemirrorNode

    const manuscriptNode = schema.nodes.manuscript.createAndFill(
      {
        id: manuscript.id,
      },
      titleNode
    ) as ProsemirrorNode

    return schema.nodes.article.createAndFill(
      {},
      [manuscriptNode].concat(rootSections.map(createSection))
    ) as ProsemirrorNode
  }

  const buildNewArticle = (manuscript: Manuscript) => {
    const titleNode = schema.nodes.title.createAndFill() as ProsemirrorNode

    const manuscriptNode = schema.nodes.manuscript.createAndFill(
      {
        id: manuscript.id,
      },
      titleNode
    ) as ProsemirrorNode

    const sectionNode = schema.nodes.section.createAndFill({
      id: generateID(ObjectTypes.SECTION),
    }) as ProsemirrorNode

    return schema.nodes.article.createAndFill({}, [
      manuscriptNode,
      sectionNode,
    ]) as ProsemirrorNode
  }

  if (manuscript.title || rootSections.length) {
    return buildExistingArticle(manuscript)
  }

  return buildNewArticle(manuscript)
}
