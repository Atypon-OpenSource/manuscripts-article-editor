import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const manuscript: NodeSpec = {
  content: 'title',
  attrs: {
    id: { default: '' },
    citationStyle: { default: '' },
    locale: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'header',
    },
  ],
  toDOM: (node: ProsemirrorNode) => ['header', node.attrs, 0],
}
