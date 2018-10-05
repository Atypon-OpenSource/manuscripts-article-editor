// adapted from 'prosemirror-tables'

import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

// tslint:disable:cyclomatic-complexity
// ^ keeping this method as close to the original as possible, for ease of updating
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
    placeholder: dom.getAttribute('data-placeholder-text') || '',
  }
}

interface TableNodeSpec extends NodeSpec {
  tableRole: string
}

export type TableNodes =
  | 'table'
  | 'thead_row'
  | 'tbody_row'
  | 'tfoot_row'
  | 'table_cell'

export const tableNodes: { [key in TableNodes]: TableNodeSpec } = {
  table: {
    content: 'thead_row tbody_row+ tfoot_row',
    tableRole: 'table',
    isolating: true,
    group: 'block',
    attrs: {
      id: { default: '' },
    },
    parseDOM: [
      {
        tag: 'table',
        getAttrs: (dom: HTMLTableElement) => ({
          id: dom.getAttribute('id'),
        }),
      },
    ],
    toDOM: node => [
      'table',
      {
        id: node.attrs.id,
      },
      ['tbody', 0],
    ],
  },
  thead_row: {
    content: 'table_cell+',
    tableRole: 'header',
    parseDOM: [
      {
        tag: 'tr.thead',
        priority: 100,
      },
      {
        tag: 'thead > tr',
        priority: 90,
      },
    ],
    toDOM: node => [
      'tr',
      {
        class: 'thead',
        // 'data-placeholder-text': node.attrs.placeholder || undefined,
      },
      0,
    ],
  },
  tbody_row: {
    content: 'table_cell+',
    tableRole: 'row',
    attrs: {
      placeholder: { default: '' },
    },
    parseDOM: [
      {
        tag: 'tr.tbody',
        priority: 100,
        getAttrs: (dom: HTMLTableRowElement) => ({
          placeholder: dom.getAttribute('data-placeholder-text'),
        }),
      },
      {
        tag: 'tbody > tr',
        priority: 90,
        getAttrs: (dom: HTMLTableRowElement) => ({
          placeholder: dom.getAttribute('data-placeholder-text'),
        }),
      },
      {
        tag: 'tr',
        priority: 80,
        getAttrs: (dom: HTMLTableRowElement) => ({
          placeholder: dom.getAttribute('data-placeholder-text'),
        }),
      },
    ],
    toDOM: node => [
      'tr',
      {
        class: 'tbody',
        'data-placeholder-text': node.attrs.placeholder || undefined,
      },
      0,
    ],
  },
  tfoot_row: {
    content: 'table_cell+',
    tableRole: 'footer',
    parseDOM: [
      {
        tag: 'tr.tfoot',
        priority: 100,
      },
      {
        tag: 'tfoot > tr',
        priority: 90,
      },
    ],
    toDOM: node => [
      'tr',
      {
        class: 'tfoot',
        'data-placeholder-text': node.attrs.placeholder || undefined,
      },
      0,
    ],
  },
  table_cell: {
    content: 'inline*',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
      background: { default: null },
      placeholder: { default: 'Data' }, // TODO: depends on cell type and position
    },
    tableRole: 'cell',
    isolating: true,
    parseDOM: [
      { tag: 'td', getAttrs: getCellAttrs },
      { tag: 'th', getAttrs: getCellAttrs },
    ],
    toDOM: (node: ProsemirrorNode) => {
      const attrs: { [attr: string]: string } = {}

      if (node.attrs.colspan !== 1) {
        attrs.colspan = node.attrs.colspan
      }

      if (node.attrs.rowspan !== 1) {
        attrs.rowspan = node.attrs.rowspan
      }

      if (node.attrs.background) {
        attrs.style = `backgroundColor: ${node.attrs.background}`
      }

      if (node.attrs.colwidth) {
        attrs['data-colwidth'] = node.attrs.colwidth.join(',')
      }

      if (node.attrs.placeholder) {
        attrs['data-placeholder-text'] = node.attrs.placeholder
      }

      if (!node.textContent) {
        attrs.class = 'placeholder'
      }

      return ['td', attrs, 0]
    },
  },
}
