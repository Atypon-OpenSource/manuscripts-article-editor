import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const codeBlock: NodeSpec = {
  attrs: {
    id: { default: '' },
    code: { default: '' },
    language: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: (node: Element) => ({
        code: node.getAttribute('code') || node.textContent,
        language: node.getAttribute('language'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => ['pre', node.attrs],
}
