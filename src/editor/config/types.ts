import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { Decoration, EditorView, NodeView } from 'prosemirror-view'
import { ThemedOuterProps } from '../../theme'

export interface StringMap<T> {
  [key: string]: T
}

export type Dispatch = (tr: Transaction) => void

export type EditorAction = (
  state: EditorState,
  dispatch: Dispatch,
  view?: EditorView
) => boolean

export type ThemedOuterButtonProps = ThemedOuterProps<HTMLButtonElement>

export type NodeViewCreator = (
  node: ProsemirrorNode,
  view: EditorView,
  getPos: () => number,
  decorations: Decoration[]
) => NodeView
