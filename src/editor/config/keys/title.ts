import { chainCommands } from 'prosemirror-commands'
import { ResolvedPos } from 'prosemirror-model'
import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { isAtEndOfTextBlock, isAtStartOfTextBlock } from '../commands'
import { EditorAction, StringMap } from '../types'

type Dispatch = (transaction: Transaction) => void

const insertParagraph = (
  dispatch: Dispatch,
  state: EditorState,
  $anchor: ResolvedPos
) => {
  const offset = $anchor.nodeAfter ? $anchor.nodeAfter.nodeSize : 0
  const pos = $anchor.pos + offset + 1
  const nextNode = state.doc.resolve(pos).nodeAfter

  let tr = state.tr

  if (
    !nextNode ||
    (nextNode.type.name !== 'paragraph' || nextNode.nodeSize > 2)
  ) {
    tr = tr.insert(pos, state.schema.nodes.paragraph.create())
  }

  tr = tr.setSelection(TextSelection.create(tr.doc, pos + 1)).scrollIntoView()

  dispatch(tr)
}

const enterNextBlock = (
  dispatch: Dispatch,
  state: EditorState,
  $anchor: ResolvedPos,
  create?: boolean
) => {
  let tr = state.tr

  const pos = $anchor.after($anchor.depth - 1)

  let selection = Selection.findFrom(tr.doc.resolve(pos), 1, true)

  if (!selection && create) {
    tr.insert(pos, state.schema.nodes.paragraph.create())
    selection = Selection.findFrom(tr.doc.resolve(pos), 1, true)
  }

  if (!selection) return false

  tr = tr.setSelection(selection).scrollIntoView()

  dispatch(tr)

  return true
}

const enterPreviousBlock = (
  dispatch: Dispatch,
  state: EditorState,
  $anchor: ResolvedPos
) => {
  const offset = $anchor.nodeBefore ? $anchor.nodeBefore.nodeSize : 0
  const $pos = state.doc.resolve($anchor.pos - offset - 1)
  const previous = Selection.findFrom($pos, -1, true)

  if (!previous) return false

  const tr = state.tr
    .setSelection(TextSelection.create(state.tr.doc, previous.from))
    .scrollIntoView()

  dispatch(tr)

  return true
}

const exitBlock = (direction: number): EditorAction => (state, dispatch) => {
  const { $anchor } = state.selection

  if (dispatch) {
    return direction === 1
      ? enterNextBlock(dispatch, state, $anchor)
      : enterPreviousBlock(dispatch, state, $anchor)
  }
  return true
}

const leaveSectionTitle: EditorAction = (state, dispatch, view) => {
  const { selection } = state

  if (!(selection instanceof TextSelection)) return false

  const { $cursor } = selection

  if (!$cursor) return false

  if ($cursor.parent.type.name !== 'section_title') {
    return false
  }

  if (!isAtEndOfTextBlock(state, $cursor, view)) {
    return false
  }

  if (dispatch) {
    insertParagraph(dispatch, state, $cursor)
  }

  return true
}

const leaveFigcaption: EditorAction = (state, dispatch) => {
  const { $anchor } = state.selection

  if ($anchor.parent.type.name !== 'figcaption') return false

  if (dispatch) {
    enterNextBlock(dispatch, state, $anchor, true)
  }

  return true
}

// ignore backspace at the start of section titles
const protectSectionTitle: EditorAction = (
  state: EditorState,
  dispatch?: Dispatch,
  view?: EditorView
) => {
  const { selection } = state

  if (!(selection instanceof TextSelection)) return false

  const { $cursor } = selection

  if (!$cursor) return false

  return (
    $cursor.parent.type.name === 'section_title' &&
    isAtStartOfTextBlock(state, $cursor, view)
  )
}

const titleKeymap: StringMap<EditorAction> = {
  Backspace: protectSectionTitle,
  Enter: chainCommands(leaveSectionTitle, leaveFigcaption),
  Tab: exitBlock(1),
  'Shift-Tab': exitBlock(-1),
}

export default titleKeymap
