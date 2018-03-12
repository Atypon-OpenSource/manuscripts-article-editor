import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { PARAGRAPH_ELEMENT } from '../../../../transformer/object-types'

export const paragraph: NodeSpec = {
  content: 'inline*',
  attrs: {
    id: { default: '' },
    'data-object-type': { default: PARAGRAPH_ELEMENT },
    'data-element-type': { default: 'p' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'p',
      getAttrs: (dom: Element) => ({
        placeholder: dom.getAttribute('placeholderInnerHTML'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['p', node.attrs, 0]
  },
}
