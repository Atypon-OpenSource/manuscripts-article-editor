import { DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model'
import schema from '../editor/config/schema'
import { iterateChildren } from '../editor/lib/utils'
import {
  AnyComponent,
  BibliographyElement,
  Citation,
  ComponentMap,
  ComponentWithAttachment,
  Equation,
  EquationElement,
  FigureElement,
  Footnote,
  FootnotesElement,
  InlineMathFragment,
  List,
  Listing,
  ListingElement,
  Paragraph,
  Section,
  Table,
  TableElement,
  TOCElement,
} from '../types/components'
import nodeTypes, { NodeTypeName } from './node-types'
import xmlSerializer from './serializer'

const serializer = DOMSerializer.fromSchema(schema)

const contents = (node: ProsemirrorNode): string => {
  const output = serializer.serializeNode(node) as HTMLElement

  return xmlSerializer.serializeToString(output)
}

const htmlContents = (node: ProsemirrorNode): string => {
  const output = serializer.serializeNode(node) as HTMLElement

  return output.outerHTML
}

export const inlineContents = (node: ProsemirrorNode): string =>
  (serializer.serializeNode(node) as HTMLElement).innerHTML

const listContents = (node: ProsemirrorNode): string => {
  const output = serializer.serializeNode(node) as HTMLElement

  for (const p of output.querySelectorAll('li > p')) {
    const parent = p.parentNode as HTMLLIElement

    while (p.hasChildNodes()) {
      parent.insertBefore(p.firstChild!, p)
    }

    parent.removeChild(p)
  }

  return xmlSerializer.serializeToString(output)
}

const svgDefs = (svg: string): string | undefined => {
  const fragment = document.createRange().createContextualFragment(svg)

  const defs = fragment.querySelector('defs')

  return defs ? xmlSerializer.serializeToString(defs) : undefined
}

const tags = ['thead', 'tbody', 'tfoot']

const tableRowDisplayStyle = (tagName: string, parent: ProsemirrorNode) => {
  switch (tagName) {
    case 'thead':
      return parent.attrs.suppressHeader ? 'none' : 'table-header-group'

    case 'tfoot':
      return parent.attrs.suppressFooter ? 'none' : 'table-footer-group'

    default:
      return null
  }
}

const buildTableSection = (
  tagName: string,
  inputRows: NodeListOf<Element>
): HTMLTableSectionElement => {
  const section = document.createElement(tagName) as HTMLTableSectionElement

  for (const sectionRow of inputRows) {
    const row = section.appendChild(document.createElement('tr'))

    for (const child of sectionRow.children) {
      const cellType = tagName === 'thead' ? 'th' : 'td'

      const cell = row.appendChild(document.createElement(cellType))

      while (child.firstChild) {
        cell.appendChild(child.firstChild)
      }

      for (const attribute of child.attributes) {
        cell.setAttribute(attribute.name, attribute.value)
      }
    }
  }

  return section
}

const tableContents = (
  node: ProsemirrorNode,
  parent: ProsemirrorNode
): string => {
  const input = serializer.serializeNode(node) as HTMLTableElement

  const output = document.createElement('table')

  output.setAttribute('id', parent.attrs.id)

  output.classList.add('MPElement')

  if (parent.attrs.tableStyle) {
    output.classList.add(parent.attrs.tableStyle.replace(/:/g, '_'))
  }

  if (parent.attrs.paragraphStyle) {
    output.classList.add(parent.attrs.paragraphStyle.replace(/:/g, '_'))
  }

  output.setAttribute('data-contained-object-id', node.attrs.id)

  for (const tagName of tags) {
    const rows = input.querySelectorAll(`tr.${tagName}`)

    const section = buildTableSection(tagName, rows)

    const displayStyle = tableRowDisplayStyle(tagName, parent)

    if (displayStyle) {
      section.style.display = displayStyle
    }

    output.appendChild(section)
  }

  return xmlSerializer.serializeToString(output)
}

const childComponentNodes = (node: ProsemirrorNode): ProsemirrorNode[] => {
  const nodes: ProsemirrorNode[] = []

  node.forEach(node => {
    if (node.type.name !== 'section') {
      nodes.push(node)
    }
  })

  return nodes
}

const attributeOfNodeType = (
  node: ProsemirrorNode,
  type: string,
  attribute: string
): string => {
  for (const child of iterateChildren(node)) {
    if (child.type.name === type) {
      return child.attrs[attribute]
    }
  }

  return ''
}

const inlineContentsOfNodeType = (
  node: ProsemirrorNode,
  type: string
): string => {
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i)

    if (child.type.name === type) {
      return inlineContents(child)
    }
  }

  return ''
}

type NodeEncoder = (
  node: ProsemirrorNode,
  parent: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
) => Partial<AnyComponent>

// type NodeEncoderMap = { [key in NodeTypeName]: NodeEncoder }
interface NodeEncoderMap {
  [key: string]: NodeEncoder
}

const encoders: NodeEncoderMap = {
  bibliography_element: (node): Partial<BibliographyElement> => ({
    elementType: 'div',
    contents: contents(node),
  }),
  bibliography_section: (node, parent, path, priority): Partial<Section> => ({
    priority: priority.value++,
    title: inlineContentsOfNodeType(node, 'section_title'),
    path: path.concat([node.attrs.id]),
    elementIDs: childComponentNodes(node)
      .map(node => node.attrs.id)
      .filter(id => id),
  }),
  bullet_list: (node): Partial<List> => ({
    elementType: 'ul',
    contents: listContents(node),
    paragraphStyle: node.attrs.paragraphStyle || undefined,
  }),
  citation: (node, parent): Partial<Citation> => ({
    containingObject: parent.attrs.id, // TODO: closest parent with an id?
    // collationType: 0,
    // TODO: make this a list of bibliography item ids?
    embeddedCitationItems: node.attrs.citationItems.map((id: string) => ({
      id,
      objectType: nodeTypes.get('citation_item') as string,
      bibliographyItem: id,
    })),
  }),
  listing: (node): Partial<Listing> => ({
    contents: inlineContents(node),
    language: node.attrs.language || undefined,
    languageKey: node.attrs.languageKey || undefined,
  }),
  listing_element: (node): Partial<ListingElement> => ({
    containedObjectID: attributeOfNodeType(node, 'listing', 'id'),
    caption: inlineContentsOfNodeType(node, 'figcaption'),
    suppressCaption: node.attrs.suppressCaption === true ? undefined : false,
  }),
  equation: (node): Partial<Equation> => ({
    TeXRepresentation: node.attrs.TeXRepresentation,
    SVGStringRepresentation: node.attrs.SVGStringRepresentation,
    // title: 'Equation',
  }),
  equation_element: (node): Partial<EquationElement> => ({
    containedObjectID: attributeOfNodeType(node, 'equation', 'id'),
    caption: inlineContentsOfNodeType(node, 'figcaption'),
    suppressCaption: Boolean(node.attrs.suppressCaption) || undefined,
  }),
  figure_element: (node): Partial<FigureElement> => ({
    containedObjectIDs: node.attrs.containedObjectIDs,
    caption: inlineContentsOfNodeType(node, 'figcaption'),
    suppressCaption: Boolean(node.attrs.suppressCaption) || undefined,
    figureStyle: node.attrs.figureStyle || undefined,
  }),
  footnote: (node, parent): Partial<Footnote> => ({
    containingObject: parent.attrs.id,
    contents: contents(node),
  }),
  footnotes_element: (node): Partial<FootnotesElement> => ({
    contents: contents(node),
  }),
  inline_equation: (node, parent): Partial<InlineMathFragment> => ({
    containingObject: parent.attrs.id,
    TeXRepresentation: node.attrs.TeXRepresentation,
    SVGRepresentation: node.attrs.SVGRepresentation,
    SVGGlyphs: svgDefs(node.attrs.SVGRepresentation),
  }),
  ordered_list: (node): Partial<List> => ({
    elementType: 'ol',
    contents: listContents(node),
    paragraphStyle: node.attrs.paragraphStyle,
  }),
  paragraph: (node): Partial<Paragraph> => ({
    elementType: 'p',
    contents: contents(node), // TODO: can't serialize citations?
    paragraphStyle: node.attrs.paragraphStyle || undefined,
  }),
  section: (node, parent, path, priority): Partial<Section> => ({
    priority: priority.value++,
    title: inlineContentsOfNodeType(node, 'section_title'),
    path: path.concat([node.attrs.id]),
    elementIDs: childComponentNodes(node)
      .map(node => node.attrs.id)
      .filter(id => id),
    titleSuppressed: node.attrs.titleSuppressed || undefined,
  }),
  table: (node, parent): Partial<Table> => ({
    contents: tableContents(node, parent),
  }),
  table_element: (node): Partial<TableElement> => ({
    containedObjectID: attributeOfNodeType(node, 'table', 'id'),
    caption: inlineContentsOfNodeType(node, 'figcaption'),
    paragraphStyle: node.attrs.paragraphStyle || undefined,
    suppressCaption: Boolean(node.attrs.suppressCaption) || undefined,
    suppressFooter: Boolean(node.attrs.suppressFooter) || undefined,
    suppressHeader: Boolean(node.attrs.suppressHeader) || undefined,
    tableStyle: node.attrs.tableStyle || undefined,
  }),
  toc_element: (node): Partial<TOCElement> => ({
    contents: htmlContents(node),
  }),
  toc_section: (node, parent, path, priority): Partial<Section> => ({
    priority: priority.value++,
    title: inlineContentsOfNodeType(node, 'section_title'),
    path: path.concat([node.attrs.id]),
    elementIDs: childComponentNodes(node)
      .map(node => node.attrs.id)
      .filter(id => id),
  }),
}

const componentData = (
  node: ProsemirrorNode,
  parent: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
): Partial<AnyComponent> => {
  const encoder = encoders[node.type.name]

  if (!encoder) throw new Error(`Unhandled component: ${node.type.name}`)

  return encoder(node, parent, path, priority)
}

export const componentFromNode = (
  node: ProsemirrorNode,
  parent: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
): Partial<ComponentWithAttachment> => {
  // TODO: in handlePaste, filter out non-standard IDs

  return {
    id: node.attrs.id,
    objectType: nodeTypes.get(node.type.name as NodeTypeName) as string,
    ...componentData(node, parent, path, priority),
  }
}

interface PrioritizedValue {
  value: number
}

export const encode = (node: ProsemirrorNode): ComponentMap => {
  const components: ComponentMap = new Map()

  const priority: PrioritizedValue = {
    value: 1,
  }

  const addComponent = (path: string[], parent: ProsemirrorNode) => (
    child: ProsemirrorNode
  ) => {
    if (!child.attrs.id) return

    const component = componentFromNode(child, parent, path, priority)
    components.set(component.id as string, component as ComponentWithAttachment)

    child.forEach(addComponent(path.concat(child.attrs.id), child))
  }

  node.forEach(addComponent([], node))

  return components
}
