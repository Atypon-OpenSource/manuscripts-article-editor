import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const bibliography: NodeSpec = {
  // atom: true,
  content: 'text*',
  attrs: {
    id: { default: '' },
    contents: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'div[class~="csl-bib-body"]',
      getAttrs: (dom: Element) => ({
        contents: dom.innerHTML,
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    const dom = document.createElement('div')
    dom.className = 'csl-bib-body'
    // TODO: use a node view?
    dom.innerHTML = node.attrs.contents // TODO: sanitise!!?

    return dom
  },
}
