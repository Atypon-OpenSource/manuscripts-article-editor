import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

const createBodyElement = (id: string) => {
  const dom = document.createElement('div')
  dom.className = 'csl-bib-body'
  dom.id = id

  return dom
}

const parseBodyElement = (contents: string) =>
  document.createRange().createContextualFragment(contents)
    .firstChild as HTMLDivElement

export const bibliography: NodeSpec = {
  atom: true,
  content: 'text*',
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
      tag: 'div[class~="csl-bib-body"]',
      getAttrs: (dom: Element) => ({
        contents: dom.innerHTML,
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return node.attrs.contents
      ? parseBodyElement(node.attrs.contents)
      : createBodyElement(node.attrs.id)
  },
}
