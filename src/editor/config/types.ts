import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { Decoration, EditorView, NodeView } from 'prosemirror-view'
import React from 'react'
import { ThemedProps } from '../../theme'

export interface StringMap<T> {
  [key: string]: T
}

export type Dispatch = (tr: Transaction) => void

export type EditorAction = (state: EditorState, dispatch: Dispatch) => boolean

export interface MenuButton {
  title: string
  content: React.ReactNode
  active?: (state: EditorState) => boolean
  run?: (state: EditorState, dispatch: Dispatch) => void
  enable?: (state: EditorState) => boolean
  dropdown?: any // tslint:disable-line:no-any // TODO
}

export type MenuButtonMap = StringMap<MenuButton>

export type MenuButtonMapMap = StringMap<MenuButtonMap>

export interface MenuBarButtonProps extends ThemedProps<HTMLButtonElement> {
  'data-active': boolean
}

export interface MenuBarProps {
  menu: MenuButtonMapMap
  state: EditorState
  dispatch: Dispatch
}

export type NodeViewCreator = (
  node: ProsemirrorNode,
  view: EditorView,
  getPos: () => number,
  decorations: Decoration[]
) => NodeView
