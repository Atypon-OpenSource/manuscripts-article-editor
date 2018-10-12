import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const placeholderElement: NodeSpec = {
  atom: true,
  selectable: false,
  attrs: {
    id: { default: '' },
  },
  group: 'block element',
  parseDOM: [
    {
      tag: 'div.placeholder-element',
      getAttrs: (dom: HTMLElement) => ({
        id: dom.getAttribute('id'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'div',
    {
      class: 'placeholder-element',
      id: node.attrs.id,
    },
  ],
}
