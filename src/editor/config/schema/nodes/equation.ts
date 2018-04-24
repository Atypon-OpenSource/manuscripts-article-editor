import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const equation: NodeSpec = {
  attrs: {
    latex: { default: '' },
  },
  atom: true,
  content: 'text*',
  inline: true,
  draggable: true,
  group: 'inline',
  parseDOM: [
    {
      tag: 'prosemirror-inline-equation',
      getAttrs: (node: Element) => ({
        latex: node.getAttribute('latex'),
      }),
      getContent: null,
    },
    // TODO: convert MathML from pasted math elements?
  ],
  toDOM: (node: ProsemirrorNode) => ['prosemirror-inline-equation', node.attrs],
}
