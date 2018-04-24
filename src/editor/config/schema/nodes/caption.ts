import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const caption: NodeSpec = {
  content: 'inline*',
  attrs: {
    id: { default: '' },
    label: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'caption',
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'caption',
    {
      id: node.attrs.id,
    },
    0,
  ],
}
