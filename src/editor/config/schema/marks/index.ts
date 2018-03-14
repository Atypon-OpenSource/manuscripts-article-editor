import { MarkSpec } from 'prosemirror-model'
import { StringMap } from '../../types'

const bold: MarkSpec = {
  parseDOM: [
    {
      tag: 'b',
      // Google Docs can produce content wrapped in <b style="fontWeight:normal">, which isn't actually bold. This workaround is copied from prosemirror-schema-basic.
      getAttrs: (dom: HTMLElement) => dom.style.fontWeight !== 'normal' && null,
    },
    { tag: 'strong' },
    {
      style: 'font-weight',
      // This regex, copied from prosemirror-schema-basic, matches all the possible "font-weight" values that can mean "bold".
      getAttrs: (value: string) =>
        /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
    },
  ],
  toDOM() {
    return ['b']
  },
}

const code: MarkSpec = {
  parseDOM: [{ tag: 'code' }],
  toDOM() {
    return ['code']
  },
}

const italic: MarkSpec = {
  parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
  toDOM() {
    return ['i']
  },
}

const link: MarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs: (dom: HTMLAnchorElement) => ({
        href: dom.getAttribute('href'),
        title: dom.getAttribute('title'),
      }),
    },
  ],
  toDOM(node) {
    return ['a', node.attrs]
  },
}

const smallcaps: MarkSpec = {
  parseDOM: [
    { style: 'font-variant=small-caps' },
    { style: 'font-variant-caps=small-caps' }, // TODO: all the other font-variant-caps options?
  ],
  toDOM: () => [
    'span',
    {
      style: 'font-variant=small-caps',
    },
  ],
}

const strikethrough: MarkSpec = {
  parseDOM: [
    { tag: 'strike' },
    { style: 'text-decoration=line-through' },
    { style: 'text-decoration-line=line-through' },
  ],
  toDOM: () => [
    'span',
    {
      style: 'text-decoration-line=line-through',
    },
  ],
}

const subscript: MarkSpec = {
  group: 'position',
  excludes: 'superscript',
  parseDOM: [{ tag: 'sub' }, { style: 'vertical-align=sub' }],
  toDOM: () => ['sub'],
}

const superscript: MarkSpec = {
  group: 'position',
  excludes: 'subscript',
  parseDOM: [{ tag: 'sup' }, { style: 'vertical-align=super' }],
  toDOM: () => ['sup'],
}

const underline: MarkSpec = {
  parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
  toDOM: () => [
    'span',
    {
      style: 'text-decoration=underline',
    },
  ],
}

const combinedMarks: StringMap<MarkSpec> = {
  bold,
  code,
  italic,
  link,
  smallcaps,
  strikethrough,
  subscript,
  superscript,
  underline,
}

export default combinedMarks
