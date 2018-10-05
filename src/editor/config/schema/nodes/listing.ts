import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { LISTING } from '../../../../transformer/object-types'

export const listing: NodeSpec = {
  attrs: {
    id: { default: '' },
    contents: { default: '' },
    language: { default: '' },
    languageKey: { default: '' },
    // placeholder: { default: 'Click to edit listing' },
  },
  group: 'block',
  parseDOM: [
    {
      tag: `pre.${LISTING}`,
      preserveWhitespace: 'full',
      getAttrs: (node: Element) => ({
        contents: node.textContent, // TODO: innerText?
        language: node.getAttribute('language'),
        languageKey: node.getAttribute('languageKey'),
      }),
      priority: 100,
    },
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: (node: Element) => ({
        contents: node.getAttribute('code') || node.textContent,
        languageKey: node.getAttribute('language'),
      }),
      priority: 90,
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    const dom = document.createElement('div')
    dom.setAttribute('id', node.attrs.id)
    dom.classList.add(LISTING)
    dom.setAttribute('data-language', node.attrs.language)
    dom.setAttribute('data-languageKey', node.attrs.languageKey)
    dom.textContent = node.attrs.contents

    return dom
  },
}
