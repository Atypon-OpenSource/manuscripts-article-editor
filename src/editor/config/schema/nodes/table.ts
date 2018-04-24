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
    content: 'thead tbody tfoot',
    tableRole: 'table',
    isolating: true,
    group: 'block',
    attrs: {
      id: { default: '' },
    },
    parseDOM: [{ tag: 'table' }],
    toDOM: () => ['table', 0],
  },
  thead: {
    content: 'table_header_row',
    tableRole: 'container',
    parseDOM: [{ tag: 'thead' }],
    toDOM: () => ['thead', 0],
  },
  tbody: {
    content: 'table_row+',
    tableRole: 'container',
    parseDOM: [{ tag: 'tbody' }],
    toDOM: () => ['tbody', 0],
  },
  tfoot: {
    content: 'table_row',
    tableRole: 'container',
    parseDOM: [{ tag: 'tfoot' }],
    toDOM: () => ['tfoot', 0],
  },
  table_header_row: {
    content: 'table_header{2,}',
    tableRole: 'row',
    parseDOM: [{ tag: 'tr', context: 'thead/' }],
    toDOM: () => ['tr', 0],
  },
  table_row: {
    content: 'table_cell{2,}',
    tableRole: 'row',
    parseDOM: [{ tag: 'tr', context: 'tbody/|tfoot/' }],
    toDOM: () => ['tr', 0],
  },
  table_header: {
    content: 'inline*',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
      background: { default: null },
    },
    tableRole: 'header_cell',
    isolating: true,
    parseDOM: [{ tag: 'th', getAttrs: getCellAttrs }],
    toDOM: (node: ProsemirrorNode) => ['th', setCellAttrs(node), 0],
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
    parseDOM: [{ tag: 'td', getAttrs: getCellAttrs }],
    toDOM: (node: ProsemirrorNode) => ['td', setCellAttrs(node), 0],
  },
}
