import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

// TODO: optional section title?

export const section: NodeSpec = {
  content:
    'section_title (paragraph | figure | table_figure | ordered_list | bullet_list | equation_block | code_block | bibliography)* section*',
  attrs: {
    id: { default: '' },
    priority: { default: 0 },
  },
  group: 'block',
  // isolating: true,
  // draggable: true,
  parseDOM: [
    {
      tag: 'section',
    },
  ],
  toDOM: (node: ProsemirrorNode) => ['section', node.attrs, 0],
}
