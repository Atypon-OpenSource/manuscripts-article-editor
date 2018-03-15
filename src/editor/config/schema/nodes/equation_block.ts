import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { EQUATION_ELEMENT } from '../../../../transformer/object-types'

export const equationBlock: NodeSpec = {
  attrs: {
    id: { default: '' },
    latex: { default: '' },
    'data-object-type': { default: EQUATION_ELEMENT },
  },
  atom: true,
  group: 'block',
  parseDOM: [
    {
      tag: 'prosemirror-equation',
      getAttrs: (node: Element) => ({
        latex: node.getAttribute('latex'),
      }),
      getContent: null,
    },
    // TODO: convert MathML from pasted math elements?
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['prosemirror-equation', node.attrs]
  },
}
