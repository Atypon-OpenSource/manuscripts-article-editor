import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const crossReference: NodeSpec = {
  inline: true,
  group: 'inline',
  draggable: true,
  atom: true,
  attrs: {
    rid: { default: '' },
    label: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span[class~="cross-reference"]',
      getAttrs: (dom: Element) => ({
        rid: dom.getAttribute('data-reference-id'),
        label: dom.textContent,
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'span',
    {
      class: 'cross-reference',
      'data-reference-id': node.attrs.rid,
    },
    [
      'span',
      {
        class: 'kind elementIndex',
      },
      ['b', node.attrs.label],
    ],
  ],
}
