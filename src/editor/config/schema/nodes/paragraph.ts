import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { PARAGRAPH } from '../../../../transformer/object-types'

export const paragraph: NodeSpec = {
  content: 'inline*',
  attrs: {
    id: { default: '' },
    paragraphStyle: { default: '' }, // TODO: default paragraph style
    placeholder: { default: '' }, // TODO: 'List item' if inside a list
    // tight: { default: false }, // https://gitlab.com/mpapp-private/manuscripts-frontend/issues/75
  },
  group: 'block element',
  parseDOM: [
    {
      tag: 'p',
      getAttrs: (dom: Element) => ({
        id: dom.getAttribute('id'),
        placeholder: dom.getAttribute('data-placeholder-text'),
        // https://gitlab.com/mpapp-private/manuscripts-frontend/issues/75
        // tight: dom.parentNode && dom.parentNode.nodeName === 'LI',
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'p',
    {
      id: node.attrs.id || undefined,
      class: ['MPElement', node.attrs.paragraphStyle.replace(/:/g, '_')]
        .filter(_ => _)
        .join(' '),
      'data-object-type': PARAGRAPH,
      'data-placeholder-text': node.attrs.placeholder || undefined,
    },
    0,
  ],
}
