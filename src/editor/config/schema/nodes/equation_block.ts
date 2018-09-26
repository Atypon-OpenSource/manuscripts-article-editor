import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const equationBlock: NodeSpec = {
  attrs: {
    id: { default: '' },
    latex: { default: '' },
    // placeholder: { default: 'Click to edit equation' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'prosemirror-equation',
      getAttrs: (node: Element) => ({
        latex: node.getAttribute('latex'),
      }),
    },
    // TODO: convert MathML from pasted math elements?
  ],
  toDOM: (node: ProsemirrorNode) => ['prosemirror-equation', node.attrs],
}
