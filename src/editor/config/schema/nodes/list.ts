import { NodeSpec } from 'prosemirror-model'
import { bulletList, listItem, orderedList } from 'prosemirror-schema-list'
import { StringMap } from '../../types'

export const listNodes: StringMap<NodeSpec> = {
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block list',
    attrs: {
      id: { default: '' },
    },
  },
  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block list',
    attrs: {
      id: { default: '' },
    },
  },
  list_item: {
    ...listItem,
    // TODO: render paragraphs in lists as just their content?
    content: 'paragraph? (paragraph | list)+',
    group: 'block',
  },
}
