import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const listingElement: NodeSpec = {
  content: '(listing | placeholder) figcaption',
  attrs: {
    id: { default: '' },
    suppressCaption: { default: true },
  },
  group: 'block element',
  parseDOM: [
    {
      tag: 'figure.listing',
      getAttrs: (dom: HTMLElement) => ({
        id: dom.getAttribute('id'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'figure',
    {
      class: 'listing', // TODO: suppress-caption?
      id: node.attrs.id,
    },
    0,
  ],
}
