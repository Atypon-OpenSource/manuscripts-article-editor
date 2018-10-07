import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

const createBodyElement = (node: ProsemirrorNode) => {
  const dom = document.createElement('div')
  dom.className = 'manuscript-toc'
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

export const tocElement: NodeSpec = {
  atom: true,
  attrs: {
    id: { default: '' },
    contents: { default: '' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'div.manuscript-toc',
      getAttrs: (dom: Element) => ({
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
