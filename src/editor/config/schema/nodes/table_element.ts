import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const tableElement: NodeSpec = {
  content: 'table figcaption',
  attrs: {
    id: { default: '' },
    paragraphStyle: { default: '' },
    tableStyle: { default: '' },
    label: { default: '' },
    suppressCaption: { default: false },
    suppressHeader: { default: false },
    suppressFooter: { default: false },
  },
  group: 'block element',
  parseDOM: [
    {
      tag: 'figure.table',
      getAttrs: (dom: HTMLElement) => {
        // const table = dom.querySelector('table')

        return {
          id: dom.getAttribute('id'),
          paragraphStyle: dom.getAttribute('data-paragraph-style') || '',
          tableStyle: dom.getAttribute('data-table-style') || '',
          // table: table ? table.id : null,
        }
      },
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'figure',
    {
      class: 'table', // TODO: suppress-header, suppress-footer?
      id: node.attrs.id,
      'data-paragraph-style': node.attrs.paragraphStyle,
      'data-table-style': node.attrs.tableStyle,
    },
    0,
  ],
}
