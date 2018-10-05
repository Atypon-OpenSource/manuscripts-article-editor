import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const inlineFootnote: NodeSpec = {
  attrs: {
    rid: { default: '' },
    contents: { default: '' },
  },
  atom: true,
  inline: true,
  draggable: true,
  group: 'inline',
  parseDOM: [
    {
      tag: 'span.footnote',
      getAttrs: (dom: Element) => ({
        rid: dom.getAttribute('id'),
        contents: dom.textContent,
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    const dom = document.createElement('span')
    dom.className = 'footnote'
    dom.setAttribute('id', node.attrs.rid)
    dom.textContent = node.attrs.contents

    return dom
  },
}
