import { NodeSpec } from 'prosemirror-model'
import { nodes } from 'prosemirror-schema-basic'
import { bulletList, listItem, orderedList } from 'prosemirror-schema-list'
import { tableNodes } from 'prosemirror-tables'
import { StringMap } from '../../types'
import { article } from './article'
import { bib } from './bib'
import { caption } from './caption'
import { citation } from './citation'
import { figcaption } from './figcaption'
import { figimage } from './figimage'
import { figure } from './figure'
import { manuscript } from './manuscript'
import { paragraph } from './paragraph'
import { section } from './section'
import { sectionTitle } from './section_title'
import { title } from './title'

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

const customNodes: StringMap<NodeSpec> = {
  article,
  bib,
  caption,
  citation,
  figcaption,
  figimage,
  figure,
  manuscript,
  paragraph,
  section,
  section_title: sectionTitle,
  title,
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
  ...customNodes,
}

export default combinedNodes
