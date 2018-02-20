import { NodeSpec } from 'prosemirror-model'
import { nodes } from 'prosemirror-schema-basic'
import { bulletList, listItem, orderedList } from 'prosemirror-schema-list'
import { tableNodes } from 'prosemirror-tables'
import { StringMap } from './types'

const listNodes: StringMap<NodeSpec> = {
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block',
  },
  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block',
  },
  list_item: {
    ...listItem,
    content: 'paragraph block*',
    group: 'block',
  },
}

const combinedNodes: StringMap<NodeSpec> = {
  ...nodes,
  ...listNodes,
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: {
        default: null,
        getFromDOM(dom: HTMLElement) {
          return dom.style.backgroundColor || null
        },
        setDOMAttr(value, attrs) {
          if (value) {
            attrs.style.backgroundColor = value
          }
        },
      },
    },
  }),
}

export default combinedNodes
