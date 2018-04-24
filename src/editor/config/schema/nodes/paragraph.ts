import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const paragraph: NodeSpec = {
  content: 'inline*',
  attrs: {
    id: { default: '' },
    placeholder: { default: 'Section contents' }, // TODO: 'List item' if inside a list
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'p',
      getAttrs: (dom: Element) => ({
        // id: dom.getAttribute('id'),
        // placeholder: dom.getAttribute('data-placeholder'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => ['p', node.attrs, 0],
}
