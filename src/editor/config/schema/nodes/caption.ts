import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

// TODO: read caption from the JSON
// TODO: table caption

export const caption: NodeSpec = {
  content: 'inline*',
  attrs: {
    id: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'caption',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['caption', node.attrs, 0]
  },
}
