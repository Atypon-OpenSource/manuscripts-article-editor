import { MarkType, Node as ProsemirrorNode, NodeType } from 'prosemirror-model'
import {
  AllSelection,
  EditorState,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state'
import schema from './schema'
import { Dispatch } from './types'

type AnySelection = NodeSelection & TextSelection & AllSelection

export const markActive = (type: MarkType) => (state: EditorState): boolean => {
  const { from, $from, to, empty } = state.selection as AnySelection

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type)
}

export const blockActive = (type: NodeType, attrs = {}) => (
  state: EditorState
) => {
  const { $from, to, node } = state.selection as AnySelection

  if (node) {
    return node.hasMarkup(type, attrs)
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs)
}

export const canInsert = (type: NodeType) => (state: EditorState) => {
  const { $from } = state.selection as AnySelection

  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d)

    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true
    }
  }

  return false
}

export const insertBlock = (type: NodeType) => (
  state: EditorState,
  dispatch: Dispatch
) => {
  dispatch(
    state.tr.insert(
      state.tr.selection.anchor,
      type.createAndFill() as ProsemirrorNode
    )
  )

  return true
}

export const insertInlineEquation = (
  state: EditorState,
  dispatch: Dispatch
) => {
  dispatch(
    state.tr.replaceSelectionWith(
      schema.nodes.equation.create({
        latex: window
          .getSelection()
          .toString()
          .replace(/^\$/, '')
          .replace(/\$$/, ''),
      })
    )
  )

  return true
}
