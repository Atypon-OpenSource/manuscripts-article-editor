import { ResolvedPos } from 'prosemirror-model'
import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state'
import { EditorAction, StringMap } from '../types'

type Dispatch = (transaction: Transaction) => void

// const insertSection = (state: EditorState, end: number) => {
//   const tr = state.tr.insert(
//     end + 1,
//     state.schema.nodes.section.createAndFill() as ProsemirrorNode
//   )
//
//   return tr.setSelection(TextSelection.create(tr.doc, end + 2)).scrollIntoView()
// }

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
  $anchor: ResolvedPos
) => {
  const offset = $anchor.nodeAfter ? $anchor.nodeAfter.nodeSize : 0
  const $pos = state.doc.resolve($anchor.pos + offset + 1)
  const next = Selection.findFrom($pos, 1, true)

  if (!next) return false

  const tr = state.tr
    .setSelection(TextSelection.create(state.tr.doc, next.from))
    .scrollIntoView()

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

const exitTitle: EditorAction = (state, dispatch) => {
  const { $anchor } = state.selection
  const node = $anchor.parent

  switch (node.type.name) {
    case 'title':
      if (dispatch) {
        enterNextBlock(dispatch, state, $anchor)
      }
      return true

    case 'section_title':
      if (dispatch) {
        insertParagraph(dispatch, state, $anchor)
      }
      return true

    default:
      return false
  }
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

const titleKeymap: StringMap<EditorAction> = {
  Enter: exitTitle,
  Tab: exitBlock(1),
  'Shift-Tab': exitBlock(-1),
}

export default titleKeymap
