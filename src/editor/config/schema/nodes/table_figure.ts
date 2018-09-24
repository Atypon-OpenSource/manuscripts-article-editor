import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const tableFigure: NodeSpec = {
  content: 'table figcaption',
  attrs: {
    id: { default: '' },
    tableStyle: { default: '' },
    label: { default: '' },
    suppressHeader: { default: false },
    suppressFooter: { default: false },
  },
  group: 'block',
  parseDOM: [
    {
      tag: 'figure.table',
      getAttrs: (dom: HTMLElement) => {
        // const table = dom.querySelector('table')

        return {
          id: dom.getAttribute('id'),
          tableStyle: dom.getAttribute('data-table-style'),
          // table: table ? table.id : null,
        }
      },
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'figure',
    {
      class: 'table',
      id: node.attrs.id,
      'data-table-style': node.attrs.tableStyle,
    },
    0,
  ],
}
