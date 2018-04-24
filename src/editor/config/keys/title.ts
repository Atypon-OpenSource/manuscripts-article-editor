import { ResolvedPos } from 'prosemirror-model'
import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
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
  const pos = $anchor.pos + offset + 3

  const tr = state.tr
    .setSelection(TextSelection.create(state.tr.doc, pos))
    .scrollIntoView()

  dispatch(tr)
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

const titleKeymap: StringMap<EditorAction> = {
  Enter: exitTitle,
  Tab: exitTitle,
}

export default titleKeymap
