import { MarkSpec } from 'prosemirror-model'
import { marks } from 'prosemirror-schema-basic'
import { StringMap } from '../../types'

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

const underline: MarkSpec = {
  parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
  toDOM: () => [
    'span',
    {
      style: 'text-decoration=underline',
    },
  ],
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

const combinedMarks: StringMap<MarkSpec> = {
  ...marks,
  subscript,
  superscript,
  strikethrough,
  underline,
  smallcaps,
}

export default combinedMarks
