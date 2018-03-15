import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const equation: NodeSpec = {
  attrs: {
    latex: { default: '' },
  },
  atom: true,
  inline: true,
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
  toDOM: (node: ProsemirrorNode) => {
    return ['prosemirror-inline-equation', node.attrs]
  },
}
