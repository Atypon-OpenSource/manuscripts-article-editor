import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const sectionTitle: NodeSpec = {
  content: 'text*',
  marks: 'italic superscript subscript smallcaps',
  attrs: {
    id: { default: '' },
  },
  group: 'block',
  defining: true,
  parseDOM: [
    {
      tag: 'h1',
    },
    {
      tag: 'h2',
    },
    {
      tag: 'h3',
    },
    {
      tag: 'h4',
    },
    {
      tag: 'h5',
    },
    {
      tag: 'h6',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['h1', {}, 0]
  },
}
