import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const article: NodeSpec = {
  content: 'manuscript section+ bibliography_section',
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
  toDOM: (node: ProsemirrorNode) => ['article', node.attrs, 0],
}
