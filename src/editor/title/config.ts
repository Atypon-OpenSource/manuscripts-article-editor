import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import {
  DOMParser,
  DOMSerializer,
  Node as ProsemirrorNode,
  NodeSpec,
  ParseOptions,
  Schema,
} from 'prosemirror-model'
import placeholder from '../config/plugins/placeholder'
import marks from '../config/schema/marks/index'

const { italic, smallcaps, subscript, superscript } = marks

const title: NodeSpec = {
  content: 'text*',
  marks: 'italic smallcaps subscript superscript',
  parseDOM: [{ tag: 'div' }],
  toDOM: () => ['div', 0],
}

export const schema = new Schema({
  nodes: {
    text: {},
    doc: {
      content: 'title',
    },
    title,
  },
  marks: {
    italic,
    smallcaps,
    subscript,
    superscript,
  },
})

const parser = DOMParser.fromSchema(schema)

export const parse = (contents: string, options?: ParseOptions) => {
  const fragment = document
    .createRange()
    .createContextualFragment(`<div>${contents || ''}</div>`)

  return parser.parse(fragment as Node, options)
}

const serializer = DOMSerializer.fromSchema(schema)

export const serialize = (node: ProsemirrorNode): string => {
  return (serializer.serializeNode(node) as HTMLElement).innerHTML
}

export const plugins = [
  history(),
  keymap({
    ...baseKeymap,
    'Mod-z': undo,
    'Mod-y': redo,
    'Mod-i': toggleMark(schema.marks.italic),
  }),
  placeholder(),
]
