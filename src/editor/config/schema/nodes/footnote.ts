import { NodeSpec } from 'prosemirror-model'

type Kind = 'footnote' | 'endnote'

const placeholderText: { [key in Kind]: string } = {
  endnote: 'Endnote',
  footnote: 'Footnote',
}

export const footnote: NodeSpec = {
  group: 'block',
  content: 'inline*',
  attrs: {
    id: { default: '' },
    contents: { default: '' },
    kind: { default: '' },
  },
  parseDOM: [
    {
      tag: 'div.footnote-contents',
      getAttrs: (dom: Element) => {
        const inner = dom.querySelector('p')

        return {
          id: dom.getAttribute('id'),
          contents: inner ? inner.innerHTML : '',
        }
      },
    },
  ],
  toDOM: node => [
    'div',
    {
      class: 'footnote-contents',
    },
    [
      'div',
      {
        class: 'footnote-text',
      },
      [
        // TODO: multiple paragraphs?
        'p',
        {
          'placeholder-text': placeholderText[node.attrs.kind as Kind],
        },
        0,
      ],
    ],
  ],
}
