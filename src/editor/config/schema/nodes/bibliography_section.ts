import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const bibliographySection: NodeSpec = {
  content: 'section_title bibliography_element',
  attrs: {
    id: { default: '' },
  },
  group: 'block sections',
  parseDOM: [
    {
      tag: 'section.bibliography',
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'section',
    {
      id: node.attrs.id,
      class: 'bibliography',
      spellcheck: 'false',
    },
    0,
  ],
}
