import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

const createBodyElement = (id: string) => {
  const dom = document.createElement('div')
  dom.className = 'csl-bib-body'
  dom.id = id

  return dom
}

// const parseBodyElement = (contents: string) =>
//   document.createRange().createContextualFragment(contents)
//     .firstChild as HTMLDivElement

export const bibliography: NodeSpec = {
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
      tag: 'div[class~="csl-bib-body"]',
      getAttrs: (dom: Element) => ({
        contents: dom.outerHTML,
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return createBodyElement(node.attrs.id)

    // TODO: https://gitlab.com/mpapp-private/manuscripts-frontend/issues/348
    // return node.attrs.contents
    //   ? parseBodyElement(node.attrs.contents)
    //   : createBodyElement(node.attrs.id)
  },
}
