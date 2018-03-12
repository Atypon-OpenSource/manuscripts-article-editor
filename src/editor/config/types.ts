import { EditorState, Transaction } from 'prosemirror-state'
import * as React from 'react'
import { ThemedStyledProps } from 'styled-components'
import { Theme } from '../../theme'

export interface StringMap<T> {
  [x: string]: T
}

export type Dispatch = (tr: Transaction) => void

export type EditorAction = (state: EditorState, dispatch: Dispatch) => boolean

export interface MenuButton {
  title: string
  content: React.ReactNode
  active?: (state: EditorState) => boolean
  run: (state: EditorState, dispatch: Dispatch) => void
  enable?: (state: EditorState) => boolean
}

export type MenuButtonMap = StringMap<MenuButton>

export type MenuButtonMapMap = StringMap<MenuButtonMap>

export type MenuBarButtonGenerator = (
  state: EditorState,
  dispatch: Dispatch
) => (key: string, item: MenuButton) => JSX.Element

export type ThemedStyledButtonProps = ThemedStyledProps<
  React.HTMLProps<HTMLButtonElement>,
  Theme
>

export interface MenuBarButtonProps extends ThemedStyledButtonProps {
  'data-active': boolean
}

export interface MenuBarProps {
  menu: MenuButtonMapMap
  state: EditorState
  dispatch: Dispatch
}
