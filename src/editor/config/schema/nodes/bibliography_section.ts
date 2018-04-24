import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const bibliographySection: NodeSpec = {
  content: 'section_title bibliography',
  attrs: {
    id: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'section.bibliography',
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'section',
    {
      id: node.attrs.id,
      class: 'bibliography', // TODO: needs a custom node view
    },
    0,
  ],
}
