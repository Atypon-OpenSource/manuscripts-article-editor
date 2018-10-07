import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

// TODO: optional section title?

export const section: NodeSpec = {
  // NOTE: the schema needs paragraphs to be the default type, so they must explicitly come first
  content: 'section_title (paragraph | element)+ footnotes_element? section*',
  attrs: {
    id: { default: '' },
    titleSuppressed: { default: false },
  },
  group: 'block sections',
  parseDOM: [
    {
      tag: 'section',
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'section',
    {
      id: node.attrs.id,
      class: node.attrs.titleSuppressed ? 'title-suppressed' : '',
    },
    0,
  ],
}
