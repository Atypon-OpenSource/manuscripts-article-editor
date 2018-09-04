import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import {
  InputRule,
  inputRules,
  wrappingInputRule,
} from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import {
  DOMParser,
  DOMSerializer,
  Node as ProsemirrorNode,
  NodeSpec,
  ParseOptions,
  Schema,
} from 'prosemirror-model'
import { nodes as basicNodes } from 'prosemirror-schema-basic'
import { NodeSelection } from 'prosemirror-state'
import { Keyword, UserProfile } from '../../../types/components'
import marks from '../../config/schema/marks'

const { blockquote, paragraph } = basicNodes
const { bold, italic, smallcaps, subscript, superscript } = marks

const doc: NodeSpec = {
  content: 'block+',
  toDOM: () => ['div', 0],
}

const text: NodeSpec = {
  group: 'inline',
}

const keyword: NodeSpec = {
  inline: true,
  atom: true,
  draggable: true,
  group: 'inline',
  attrs: {
    name: { default: '' },
    keywordID: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span.keyword',
      getAttrs: (dom: HTMLElement) => ({
        name: dom.textContent,
        keywordID: dom.getAttribute('data-keyword'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'span',
    {
      class: 'keyword',
      'data-keyword': node.attrs.keywordID,
    },
    node.attrs.name,
  ],
}

const mention: NodeSpec = {
  inline: true,
  atom: true,
  draggable: true,
  group: 'inline',
  attrs: {
    name: { default: '' },
    userID: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span.mention',
      getAttrs: (dom: HTMLElement) => ({
        name: dom.textContent,
        userID: dom.getAttribute('data-user'),
      }),
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'span',
    {
      class: 'mention',
      'data-user': node.attrs.userID,
    },
    node.attrs.name,
  ],
}

export const schema = new Schema({
  nodes: {
    doc,
    blockquote,
    keyword,
    mention,
    paragraph,
    text,
  },
  marks: {
    bold,
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

const rules = inputRules({
  rules: [
    // > blockquote
    wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),

    // @mention
    new InputRule(/@\w*/, (state, match, start, end) => {
      let tr = state.tr
      tr = tr.replaceWith(start, end, schema.nodes.mention.createChecked())
      tr = tr.setSelection(NodeSelection.create(tr.doc, start))
      return tr
    }),

    // #keyword
    new InputRule(/#\w*/, (state, match, start, end) => {
      let tr = state.tr
      tr = tr.replaceWith(start, end, schema.nodes.keyword.createChecked())
      tr = tr.setSelection(NodeSelection.create(tr.doc, start))
      return tr
    }),
  ],
})

export interface UserWithName extends UserProfile {
  name: string
}

export type GetCollaborators = () => UserWithName[]
export type GetUser = (id: string) => UserProfile | undefined

export type GetKeywords = () => Keyword[]
export type GetKeyword = (id: string) => Keyword | undefined
export type CreateKeyword = (name: string) => Promise<Keyword>

export const plugins = [
  rules,
  keymap(baseKeymap),
  keymap({
    'Mod-z': undo,
    'Mod-y': redo,
    'Mod-i': toggleMark(schema.marks.italic),
    'Mod-b': toggleMark(schema.marks.bold),
  }),
  history(),
]

export const createDoc = () => schema.nodes.doc.create() as ProsemirrorNode
