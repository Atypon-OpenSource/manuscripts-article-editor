import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { MANUSCRIPT } from '../../../../transformer/object-types'

export const manuscript: NodeSpec = {
  content: 'title',
  attrs: {
    id: { default: '' },
    'data-object-type': { default: MANUSCRIPT },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'header',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['header', node.attrs, 0]
  },
}
