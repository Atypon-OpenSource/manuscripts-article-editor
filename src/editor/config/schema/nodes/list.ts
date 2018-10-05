import { NodeSpec } from 'prosemirror-model'
import { LIST_ELEMENT } from '../../../../transformer/object-types'

export type ListNodes = 'ordered_list' | 'bullet_list' | 'list_item'

export const listNodes: { [key in ListNodes]: NodeSpec } = {
  ordered_list: {
    content: 'list_item+',
    group: 'block list element',
    attrs: {
      id: { default: '' },
      // order: { default: 1 },
      paragraphStyle: { default: '' },
    },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs: (dom: HTMLOListElement) => ({
          id: dom.getAttribute('id'),
          // order: dom.hasAttribute('start') ? dom.getAttribute('start') : 1,
        }),
      },
    ],
    toDOM: node =>
      node.attrs.id
        ? [
            'ol',
            {
              id: node.attrs.id,
              // start: node.attrs.order === 1 ? undefined : node.attrs.order,
              class: ['MPElement', node.attrs.paragraphStyle.replace(/:/g, '_')]
                .filter(_ => _)
                .join(' '),
              'data-object-type': LIST_ELEMENT,
            },
            0,
          ]
        : ['ol', 0],
  },
  bullet_list: {
    content: 'list_item+',
    group: 'block list element',
    attrs: {
      id: { default: '' },
      paragraphStyle: { default: '' },
    },
    parseDOM: [{ tag: 'ul' }],
    // @ts-ignore: undefined
    toDOM: node =>
      node.attrs.id
        ? [
            'ul',
            {
              id: node.attrs.id,
              // start: node.attrs.order === 1 ? undefined : node.attrs.order,
              class: ['MPElement', node.attrs.paragraphStyle.replace(/:/g, '_')]
                .filter(_ => _)
                .join(' '),
              'data-object-type': LIST_ELEMENT,
            },
            0,
          ]
        : ['ul', 0],
  },
  list_item: {
    // NOTE: can't mix inline (text) and block content (list)
    // content: 'paragraph list+',
    content: 'paragraph? (paragraph | list)+',
    group: 'block',
    defining: true,
    attrs: {
      placeholder: { default: 'List item' },
    },
    parseDOM: [
      {
        tag: 'li',
        getAttrs: (dom: HTMLLIElement) => ({
          placeholder: dom.getAttribute('data-placeholder-text'),
        }),
      },
    ],
    toDOM: node => [
      'li',
      {
        'data-placeholder-text': node.attrs.placeholder || undefined,
      },
      0,
    ],
  },
}
