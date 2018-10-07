import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { INLINE_MATH_FRAGMENT } from '../../../../transformer/object-types'

export const inlineEquation: NodeSpec = {
  // TODO: rid?
  attrs: {
    id: { default: '' },
    TeXRepresentation: { default: '' },
    SVGRepresentation: { default: '' },
  },
  atom: true,
  inline: true,
  draggable: true,
  group: 'inline',
  parseDOM: [
    {
      tag: `span.${INLINE_MATH_FRAGMENT}`,
      getAttrs: (node: Element) => ({
        id: node.getAttribute('id'),
        TeXRepresentation: node.getAttribute('data-tex-representation'),
        SVGRepresentation: node.innerHTML,
      }),
    },
    // TODO: convert MathML from pasted math elements?
  ],
  toDOM: (node: ProsemirrorNode) => {
    const dom = document.createElement('span')
    dom.classList.add(INLINE_MATH_FRAGMENT)
    dom.setAttribute('id', node.attrs.id)
    dom.setAttribute('data-tex-representation', node.attrs.TeXRepresentation)
    dom.innerHTML = node.attrs.SVGRepresentation

    return dom
  },
}
