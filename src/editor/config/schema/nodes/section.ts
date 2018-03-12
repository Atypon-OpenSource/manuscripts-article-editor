import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { SECTION } from '../../../../transformer/object-types'

// TODO: optional section title?

export const section: NodeSpec = {
  content: 'section_title (paragraph | figure | bib)* section*', // TODO: elements must be before sections?
  attrs: {
    id: { default: '' },
    child: { default: false },
    'data-object-type': { default: SECTION },
    'data-element-type': { default: 'section' },
  },
  group: 'block',
  draggable: true,
  parseDOM: [
    {
      tag: 'section',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['section', node.attrs, 0]
  },
}
