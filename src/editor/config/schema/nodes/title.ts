import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const title: NodeSpec = {
  content: 'text*',
  marks: 'italic superscript subscript smallcaps',
  attrs: {
    placeholder: { default: 'Title' },
  },
  group: 'metadata',
  parseDOM: [
    {
      tag: 'h1',
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'h1',
    {
      'data-placeholder': node.attrs.placeholder,
    },
    0,
  ],
}
