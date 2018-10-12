import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const equationElement: NodeSpec = {
  content: '(equation | placeholder) figcaption',
  attrs: {
    id: { default: '' },
    suppressCaption: { default: true },
  },
  selectable: false,
  group: 'block element',
  parseDOM: [
    {
      tag: 'figure.equation',
      getAttrs: (dom: HTMLElement) => ({
        id: dom.getAttribute('id'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'figure',
    {
      class: 'equation', // TODO: suppress-caption?
      id: node.attrs.id,
    },
    0,
  ],
}
