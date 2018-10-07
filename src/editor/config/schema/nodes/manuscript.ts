import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const manuscript: NodeSpec = {
  content: '(section | bibliography_section | toc_section)+',
  attrs: {
    id: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'article',
      getAttrs: (dom: Element) => ({
        id: dom.getAttribute('id'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'article',
    {
      id: node.attrs.id,
    },
    0,
  ],
}
