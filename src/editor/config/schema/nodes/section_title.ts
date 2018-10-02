import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const sectionTitle: NodeSpec = {
  content: 'text*',
  marks: 'italic superscript subscript smallcaps',
  group: 'block',
  defining: true,
  isolating: true,
  selectable: false,
  attrs: {
    // placeholder: { default: 'Section heading' },
  },
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
  toDOM: (node: ProsemirrorNode) => [
    'h1',
    {
      'data-placeholder': node.attrs.placeholder,
    },
    0,
  ],
}
