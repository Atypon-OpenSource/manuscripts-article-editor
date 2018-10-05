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

export const bibliographyElement: NodeSpec = {
  atom: true,
  attrs: {
    id: { default: '' },
    contents: { default: '' },
    placeholder: {
      default:
        'Citations inserted to the manuscript will be formatted here as a bibliography.',
    },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'div.csl-bib-body',
      getAttrs: (dom: Element) => ({
        contents: dom.outerHTML,
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return node.attrs.contents
      ? parseBodyElement(node)
      : createBodyElement(node)
  },
}
