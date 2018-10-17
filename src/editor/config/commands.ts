import {
  MarkType,
  Node as ProsemirrorNode,
  NodeType,
  ResolvedPos,
} from 'prosemirror-model'
import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { buildFootnote, buildInlineMathFragment } from '../../lib/commands'
import { isElementNode } from '../../transformer/node-types'
import { INSERT, modelsKey } from './plugins/models'
import schema from './schema'
import { Dispatch } from './types'

export const markActive = (type: MarkType) => (state: EditorState): boolean => {
  const { from, $from, to, empty } = state.selection

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type)
}

export const blockActive = (type: NodeType, attrs = {}) => (
  state: EditorState
) => {
  const { selection } = state

  if (selection instanceof NodeSelection) {
    return selection.node.hasMarkup(type, attrs)
  }

  const { to, $from } = selection

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs)
}

export const canInsert = (type: NodeType) => (state: EditorState) => {
  const { $from } = state.selection

  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d)

    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true
    }
  }

  return false
}

const findBlockInsertPosition = (state: EditorState) => {
  const { $from } = state.selection

  for (let d = $from.depth; d >= 0; d--) {
    const node = $from.node(d)

    if (isElementNode(node)) {
      return $from.after(d)
    }
  }

  return null
}

export const createSelection = (
  nodeType: NodeType,
  position: number,
  doc: ProsemirrorNode
) => {
  if (nodeType.isAtom) {
    return NodeSelection.create(doc, position)
  }

  return TextSelection.near(doc.resolve(position + 1))
}

export const createBlock = (
  nodeType: NodeType,
  position: number,
  state: EditorState,
  dispatch: Dispatch
) => {
  const node = (nodeType.name === 'table_element'
    ? createAndFillTableElement()
    : nodeType.createAndFill()) as ProsemirrorNode

  let tr = state.tr.insert(position, node)

  const selection = createSelection(nodeType, position, tr.doc)

  tr = tr.setSelection(selection).scrollIntoView()

  dispatch(tr)
}

export const insertBlock = (nodeType: NodeType) => (
  state: EditorState,
  dispatch: Dispatch
) => {
  const position = findBlockInsertPosition(state)

  if (position === null) return false

  createBlock(nodeType, position, state, dispatch)

  return true
}

export const insertInlineEquation = (
  state: EditorState,
  dispatch: Dispatch
) => {
  const inlineMathFragment = buildInlineMathFragment(
    state.selection.$anchor.parent.attrs.id,
    window
      .getSelection()
      .toString()
      .replace(/^\$/, '')
      .replace(/\$$/, '')
  )

  const tr = state.tr
    .setMeta(modelsKey, { [INSERT]: [inlineMathFragment] })
    .replaceSelectionWith(schema.nodes.inline_equation.create())

  dispatch(tr.setSelection(NodeSelection.create(tr.doc, tr.selection.from - 1)))

  return true
}

export const insertInlineFootnote = (
  state: EditorState,
  dispatch: Dispatch
) => {
  const footnote = buildFootnote(
    state.selection.$anchor.parent.attrs.id,
    window.getSelection().toString()
  )

  const node = schema.nodes.inline_footnote.create()

  const pos = state.selection.to

  const tr = state.tr
    .setMeta(modelsKey, { [INSERT]: [footnote] })
    .insert(pos, node)

  dispatch(tr.setSelection(NodeSelection.create(tr.doc, pos)))

  return true
}

/**
 * Call the callback (a prosemirror-tables command) if the current selection is in the table body
 */
export const ifInTableBody = (command: (state: EditorState) => boolean) => (
  state: EditorState
): boolean => {
  const $head = state.selection.$head

  for (let d = $head.depth; d > 0; d--) {
    if ($head.node(d).type.name === 'tbody_row') {
      return command(state)
    }
  }

  return false
}

// Copied from prosemirror-commands
const findCutBefore = ($pos: ResolvedPos) => {
  if (!$pos.parent.type.spec.isolating) {
    for (let i = $pos.depth - 1; i >= 0; i--) {
      if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1))
      if ($pos.node(i).type.spec.isolating) break
    }
  }
  return null
}

export const isAtStartOfTextBlock = (
  state: EditorState,
  $cursor: ResolvedPos,
  view?: EditorView
) => (view ? view.endOfTextblock('backward', state) : $cursor.parentOffset <= 0)

// Ignore atom blocks (as backspace handler), instead of deleting them.
// Adapted from selectNodeBackward in prosemirror-commands
export const ignoreAtomBlockNodeBackward = (
  state: EditorState,
  dispatch?: Dispatch,
  view?: EditorView
): boolean => {
  const { selection } = state

  if (!(selection instanceof TextSelection)) return false

  const { $cursor } = selection

  if (!$cursor) return false

  // ignore empty blocks
  if ($cursor.parent.content.size === 0) return false

  // handle cursor at start of textblock
  if (!isAtStartOfTextBlock(state, $cursor, view)) {
    return false
  }

  const $cut = findCutBefore($cursor)

  if (!$cut) return false

  const node = $cut.nodeBefore

  if (!node) return false

  return node.isBlock && node.isAtom
}

// Copied from prosemirror-commands
const findCutAfter = ($pos: ResolvedPos) => {
  if (!$pos.parent.type.spec.isolating) {
    for (let i = $pos.depth - 1; i >= 0; i--) {
      const parent = $pos.node(i)
      if ($pos.index(i) + 1 < parent.childCount) {
        return $pos.doc.resolve($pos.after(i + 1))
      }
      if (parent.type.spec.isolating) break
    }
  }
  return null
}

export const isAtEndOfTextBlock = (
  state: EditorState,
  $cursor: ResolvedPos,
  view?: EditorView
) =>
  view
    ? view.endOfTextblock('forward', state)
    : $cursor.parentOffset >= $cursor.parent.content.size

// Ignore atom blocks (as delete handler), instead of deleting them.
// Adapted from selectNodeForward in prosemirror-commands
export const ignoreAtomBlockNodeForward = (
  state: EditorState,
  dispatch?: Dispatch,
  view?: EditorView
): boolean => {
  const { selection } = state

  if (!(selection instanceof TextSelection)) return false

  const { $cursor } = selection

  if (!$cursor) return false

  // ignore empty blocks
  if ($cursor.parent.content.size === 0) return false

  // handle cursor at start of textblock
  if (!isAtEndOfTextBlock(state, $cursor, view)) {
    return false
  }

  const $cut = findCutAfter($cursor)

  if (!$cut) return false

  const node = $cut.nodeAfter

  if (!node) return false

  return node.isBlock && node.isAtom
}

const selectIsolatingParent = (state: EditorState): TextSelection | null => {
  const { $anchor } = state.selection

  for (let d = $anchor.depth; d >= 0; d--) {
    const node = $anchor.node(d)

    if (node.type.spec.isolating) {
      return TextSelection.create(state.doc, $anchor.start(d), $anchor.end(d))
    }
  }

  return null
}

/**
 * "Select All" the contents of an isolating block instead of the whole document
 */
export const selectAllIsolating = (
  state: EditorState,
  dispatch?: Dispatch
): boolean => {
  const selection = selectIsolatingParent(state)

  if (!selection) return false

  if (dispatch) {
    dispatch(state.tr.setSelection(selection))
  }

  return true
}

/**
 * Create a figure containing a 2x2 table with header and footer and a figcaption
 */
export const createAndFillTableElement = () =>
  schema.nodes.table_element.create({}, [
    schema.nodes.table.create({}, [
      schema.nodes.thead_row.create({}, [
        schema.nodes.table_cell.create(),
        schema.nodes.table_cell.create(),
      ]),
      schema.nodes.tbody_row.create({}, [
        schema.nodes.table_cell.create(),
        schema.nodes.table_cell.create(),
      ]),
      schema.nodes.tbody_row.create({}, [
        schema.nodes.table_cell.create(),
        schema.nodes.table_cell.create(),
      ]),
      schema.nodes.tfoot_row.create({}, [
        schema.nodes.table_cell.create(),
        schema.nodes.table_cell.create(),
      ]),
    ]),
    schema.nodes.figcaption.create(),
  ])
