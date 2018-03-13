import { NodeSpec } from 'prosemirror-model'
import { bulletList, listItem, orderedList } from 'prosemirror-schema-list'
import { LIST_ELEMENT } from '../../../../transformer/object-types'
import { StringMap } from '../../types'

export const listNodes: StringMap<NodeSpec> = {
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block list',
    attrs: {
      id: { default: '' },
      'data-object-type': { default: LIST_ELEMENT },
      'data-element-type': { default: 'ol' },
    },
  },
  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block list',
    attrs: {
      id: { default: '' },
      'data-object-type': { default: LIST_ELEMENT },
      'data-element-type': { default: 'ul' },
    },
  },
  list_item: {
    ...listItem,
    content: 'paragraph? (paragraph | list)+',
    group: 'block',
  },
}
