import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const placeholder: NodeSpec = {
  atom: true,
  selectable: false,
  attrs: {
    id: { default: '' },
    label: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'div.placeholder',
      getAttrs: (dom: HTMLElement) => ({
        id: dom.getAttribute('id'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'div',
    {
      class: 'placeholder-item',
      id: node.attrs.id,
    },
  ],
}
