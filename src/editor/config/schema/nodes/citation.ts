import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

// TODO: export toJSON and fromJSON methods for use in serializer

export const citation: NodeSpec = {
  inline: true,
  group: 'inline',
  draggable: true,
  atom: true,
  content: 'text*',
  // content: 'inline*',
  attrs: {
    rid: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span[class~="citation"][data-reference-id]',
      getAttrs: (dom: Element) => ({
        rid: dom.getAttribute('data-reference-id'),
      }),
    },
    // {
    //   tag: 'a[class~="citation"][href^="#"]',
    //   getAttrs: (dom: Element) => ({
    //     rid: (dom.getAttribute('href') as string).substr(1),
    //   }),
    // },
  ],
  toDOM: (node: ProsemirrorNode) => {
    const { rid } = node.attrs

    const attrs = {
      class: 'citation',
      'data-reference-id': rid,
      contenteditable: 'false',
    }

    return ['span', attrs, 0]
  },
}
