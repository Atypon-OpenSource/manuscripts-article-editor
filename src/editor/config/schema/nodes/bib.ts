import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const bib: NodeSpec = {
  content: 'text*',
  attrs: {
    id: { default: '' },
    class: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'div[class~="csl-bib-body"]',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    const attrs = {
      ...node.attrs,
      class: 'csl-bib-body',
    }

    return ['div', attrs, 0]
  },
}
