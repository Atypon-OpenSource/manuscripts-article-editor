import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { FIGURE_ELEMENT } from '../../../../transformer/object-types'

export const figure: NodeSpec = {
  content: 'figimage* table* figcaption',
  attrs: {
    id: { default: '' },
    'data-object-type': { default: FIGURE_ELEMENT },
    'data-element-type': { default: 'figure' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'figure',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['figure', node.attrs, 0]
  },
}
