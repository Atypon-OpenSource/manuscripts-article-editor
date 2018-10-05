import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

const createBodyElement = (node: ProsemirrorNode) => {
  const dom = document.createElement('div')
  dom.className = 'csl-bib-body'
  dom.id = node.attrs.id

  return dom
}

const parseBodyElement = (node: ProsemirrorNode): Node => {
  // return document.createRange().createContextualFragment(node.attrs.contents)
  //   .firstChild as HTMLDivElement

  const dom = document.createElement('div')
  dom.innerHTML = node.attrs.contents // TODO: sanitize?
  return dom.firstChild || createBodyElement(node)
}

export const footnotesElement: NodeSpec = {
  atom: true,
  attrs: {
    id: { default: '' },
    // collateByKind: { default: 'footnote' },
    contents: { default: '' },
  },
  group: 'block element',
  parseDOM: [
    {
      tag: 'div.footnotes',
      getAttrs: (dom: Element) => ({
        // collateByKind: dom.getAttribute('collateByKind'),
        contents: dom.innerHTML,
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return node.attrs.contents
      ? parseBodyElement(node)
      : createBodyElement(node)
  },
}
