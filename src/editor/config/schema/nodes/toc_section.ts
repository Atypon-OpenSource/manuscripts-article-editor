import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const tocSection: NodeSpec = {
  content: 'section_title toc_element',
  attrs: {
    id: { default: '' },
  },
  group: 'block sections',
  parseDOM: [
    {
      tag: 'section.toc',
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'section',
    {
      id: node.attrs.id,
      class: 'toc',
      spellcheck: 'false',
    },
    0,
  ],
}
