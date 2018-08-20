import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const citation: NodeSpec = {
  inline: true,
  group: 'inline',
  draggable: true,
  atom: true,
  // content: 'text*',
  attrs: {
    rid: { default: '' },
    contents: { default: '' },
    // citationItems: { default: [] },
  },
  parseDOM: [
    {
      tag: 'span[class~="citation"]',
      getAttrs: (dom: Element) => ({
        // id: dom.id,
        rid: dom.getAttribute('data-reference-id'),
        contents: dom.innerHTML,
        // citationItems: (dom.getAttribute('data-citation-items') || '').split(
        //   '|'
        // ),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    const dom = document.createElement('span')
    dom.className = 'citation'
    // dom.id = node.attrs.id
    dom.setAttribute('data-reference-id', node.attrs.rid)
    // dom.setAttribute('data-citation-items', node.attrs.citationItems.join('|'))
    dom.innerHTML = node.attrs.contents

    return dom
  },
}
