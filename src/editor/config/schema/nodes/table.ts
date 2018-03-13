import { tableNodes as createTableNodes } from 'prosemirror-tables'

export const tableNodes = createTableNodes({
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
})
