import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const figimage: NodeSpec = {
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
  },
  group: 'block',
  draggable: true,
  parseDOM: [
    {
      tag: 'figure > img[src]',
      getAttrs(dom: Element) {
        return {
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
        }
      },
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['img', node.attrs]
  },
}
