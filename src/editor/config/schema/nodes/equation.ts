import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { EQUATION } from '../../../../transformer/object-types'

export const equation: NodeSpec = {
  attrs: {
    id: { default: '' },
    TeXRepresentation: { default: '' },
    SVGStringRepresentation: { default: '' },
    // placeholder: { default: 'Click to edit equation' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: `div.${EQUATION}`,
      getAttrs: (node: Element) => ({
        TeXRepresentation: node.getAttribute('data-tex-representation'),
        SVGStringRepresentation: node.innerHTML,
      }),
    },
    // TODO: convert MathML from pasted math elements?
  ],
  toDOM: (node: ProsemirrorNode) => {
    const dom = document.createElement('div')
    dom.setAttribute('id', node.attrs.id)
    dom.classList.add(EQUATION)
    dom.setAttribute('data-tex-representation', node.attrs.TeXRepresentation)
    dom.innerHTML = node.attrs.SVGStringRepresentation

    return dom
  },
}
