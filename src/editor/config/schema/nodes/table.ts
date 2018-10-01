// adapted from 'prosemirror-tables'

import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import { StringMap } from '../../types'

const getCellAttrs = (dom: HTMLElement) => {
  const widthAttr = dom.getAttribute('data-colwidth')
  const widths =
    widthAttr && /^\d+(,\d+)*$/.test(widthAttr)
      ? widthAttr.split(',').map(s => Number(s))
      : null
  const colspan = Number(dom.getAttribute('colspan') || 1)

  return {
    colspan,
    rowspan: Number(dom.getAttribute('rowspan') || 1),
    colwidth: widths && widths.length === colspan ? widths : null,
    background: dom.style.backgroundColor || null,
  }
}

const setCellAttrs = (node: ProsemirrorNode) => {
  const attrs: StringMap<any> = {} // tslint:disable-line:no-any
  if (node.attrs.colspan !== 1) attrs.colspan = node.attrs.colspan
  if (node.attrs.rowspan !== 1) attrs.rowspan = node.attrs.rowspan
  if (node.attrs.colwidth) {
    attrs['data-colwidth'] = node.attrs.colwidth.join(',')
  }
  if (node.attrs.backgroundColor) {
    attrs.style.backgroundColor = node.attrs.backgroundColor
  }
  return attrs
}

interface TableNodeSpec extends NodeSpec {
  tableRole: string
}

export const tableNodes: StringMap<TableNodeSpec> = {
  table: {
    content: 'thead_row tbody_row+ tfoot_row',
    tableRole: 'table',
    isolating: true,
    group: 'block',
    attrs: {
      id: { default: '' },
    },
    parseDOM: [{ tag: 'table' }],
    toDOM: () => ['table', ['tbody', 0]],
  },
  thead_row: {
    content: 'table_cell+',
    tableRole: 'header',
    parseDOM: [
      { tag: 'tr.thead', priority: 100 },
      { tag: 'thead > tr', priority: 90 },
    ],
    toDOM: () => ['tr', { class: 'thead' }, 0],
  },
  tbody_row: {
    content: 'table_cell+',
    tableRole: 'row',
    parseDOM: [
      { tag: 'tr.tbody', priority: 100 },
      { tag: 'tbody > tr', priority: 90 },
      { tag: 'tr', priority: 80 },
    ],
    toDOM: () => ['tr', { class: 'tbody' }, 0],
  },
  tfoot_row: {
    content: 'table_cell+',
    tableRole: 'footer',
    parseDOM: [
      { tag: 'tr.tfoot', priority: 100 },
      { tag: 'tfoot > tr', priority: 90 },
    ],
    toDOM: () => ['tr', { class: 'tfoot' }, 0],
  },
  table_cell: {
    content: 'inline*',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
      background: { default: null },
    },
    tableRole: 'cell',
    isolating: true,
    parseDOM: [
      { tag: 'td', getAttrs: getCellAttrs },
      { tag: 'th', getAttrs: getCellAttrs },
    ],
    toDOM: (node: ProsemirrorNode) => ['td', setCellAttrs(node), 0],
  },
}
