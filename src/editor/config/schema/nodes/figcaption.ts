import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

// TODO: read caption from the JSON
// TODO: table caption

export const figcaption: NodeSpec = {
  content: 'inline+',
  attrs: {
    id: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'figcaption',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['figcaption', node.attrs, 0]
  },
}
