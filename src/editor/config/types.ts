import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { Decoration, EditorView, NodeView } from 'prosemirror-view'
import React from 'react'
import { ThemedOuterProps } from '../../theme'

export interface StringMap<T> {
  [key: string]: T
}

export type Dispatch = (tr: Transaction) => void

export type EditorAction = (state: EditorState, dispatch: Dispatch) => boolean

export interface ToolbarButton {
  title: string
  content: React.ReactNode
  active?: (state: EditorState) => boolean
  run?: (state: EditorState, dispatch: Dispatch) => void
  enable?: (state: EditorState) => boolean
  dropdown?: any // tslint:disable-line:no-any // TODO
}

export type ToolbarButtonMap = StringMap<ToolbarButton>

export type ToolbarButtonMapMap = StringMap<ToolbarButtonMap>

export type ThemedOuterButtonProps = ThemedOuterProps<HTMLButtonElement>

export interface ToolbarButtonProps extends ThemedOuterButtonProps {
  'data-active'?: boolean
}

export interface ToolbarProps {
  toolbar: ToolbarButtonMapMap
  state: EditorState
  dispatch: Dispatch
}

export type NodeViewCreator = (
  node: ProsemirrorNode,
  view: EditorView,
  getPos: () => number,
  decorations: Decoration[]
) => NodeView
