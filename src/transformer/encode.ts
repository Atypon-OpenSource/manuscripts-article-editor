import { DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model'
import { options } from '../editor/config'
import { AnyComponent, Component, ComponentMap } from '../types/components'
import nodeTypes from './node-types'

const { schema } = options

const serializer = DOMSerializer.fromSchema(schema)

const contents = (node: ProsemirrorNode): string =>
  (serializer.serializeNode(node) as HTMLElement).outerHTML

const childComponentNodes = (node: ProsemirrorNode): ProsemirrorNode[] => {
  const nodes: ProsemirrorNode[] = []

  node.forEach(node => {
    if (node.type.name !== 'section') {
      nodes.push(node)
    }
  })

  return nodes
}

const idOfNodeType = (node: ProsemirrorNode, type: string): string => {
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i)

    if (child.type.name === type) {
      return child.attrs.id
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
      return (serializer.serializeNode(child) as HTMLElement).innerHTML
    }
  }

  return ''
}

type ComponentData = (
  node: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
) => object

type NodeEncoder = (
  node: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
) => Partial<AnyComponent>

interface NodeEncoderMap {
  [key: string]: NodeEncoder
}

const encoders: NodeEncoderMap = {
  bibliography: node => ({
    contents: contents(node),
  }),
  bibliography_section: (node, path, priority) => ({
    priority: priority.value++,
    title: inlineContentsOfNodeType(node, 'section_title'),
    path: path.concat([node.attrs.id]),
    elementIDs: childComponentNodes(node).map(node => node.attrs.id),
  }),
  bullet_list: node => ({
    elementType: 'ul',
    contents: contents(node), // TODO: unwrap paragraphs
  }),
  citation: node => ({
    // containingElement: '',
    // collationType: 0,
    // TODO: make this a list of bibliography item ids?
    embeddedCitationItems: node.attrs.citationItems.map((id: string) => ({
      id,
      objectType: nodeTypes.get('citation_item') as string,
      bibliographyItem: id,
    })),
  }),
  code_block: node => ({
    title: 'Listing',
    contents: node.attrs.code,
    // language: node.attrs.language // TODO
    languageKey: node.attrs.language,
  }),
  equation_block: node => ({
    title: 'Equation',
    TeXRepresentation: node.attrs.latex,
  }),
  figure: node => ({
    containedObjectIDs: node.attrs.containedObjectIDs,
    caption: inlineContentsOfNodeType(node, 'figcaption'),
    figureStyle: node.attrs.figureStyle,
  }),
  manuscript: node => ({
    title: inlineContentsOfNodeType(node, 'title'),
  }),
  ordered_list: node => ({
    elementType: 'ol',
    contents: contents(node), // TODO: unwrap paragraphs
  }),
  paragraph: node => ({
    contents: contents(node), // TODO: can't serialize citations?
  }),
  section: (node, path, priority) => ({
    priority: priority.value++,
    title: inlineContentsOfNodeType(node, 'section_title'),
    path: path.concat([node.attrs.id]),
    elementIDs: childComponentNodes(node).map(node => node.attrs.id),
  }),
  table: node => ({
    contents: contents(node),
  }),
  table_figure: node => ({
    containedObjectID: idOfNodeType(node, 'table'),
    caption: inlineContentsOfNodeType(node, 'figcaption'),
  }),
}

const componentData: ComponentData = (
  node,
  path,
  priority
): Partial<AnyComponent> => {
  const encoder = encoders[node.type.name]

  if (encoder) {
    return encoder(node, path, priority)
  }

  // TODO: log unhandled components
  // tslint:disable-next-line:no-console
  console.warn('Unhandled component', node.type.name)
  return {}
}

type ComponentBuilder = (
  node: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
) => Component

export const componentFromNode: ComponentBuilder = (
  node,
  path,
  priority
): Component => {
  // TODO: in handlePaste, filter out non-standard IDs

  return {
    id: node.attrs.id,
    objectType: nodeTypes.get(node.type.name) as string,
    ...componentData(node, path, priority),
  }
}

interface PrioritizedValue {
  value: number
}

export const encode = (node: ProsemirrorNode): ComponentMap => {
  const components = new Map()

  const priority: PrioritizedValue = {
    value: 0,
  }

  const addComponent = (path: string[]) => (child: ProsemirrorNode) => {
    if (!child.attrs.id) return

    const component = componentFromNode(child, path, priority)
    components.set(component.id, component)

    child.forEach(addComponent(path.concat(child.attrs.id)))
  }

  node.forEach(addComponent([]))

  return components
}
