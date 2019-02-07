import React from 'react'
import * as styledComponents from 'styled-components'
import { Theme } from './types'

// https://www.styled-components.com/docs/api#typescript

const {
  default: styled,
  css,
  createGlobalStyle,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>

export { createGlobalStyle, css, styled, ThemeProvider }

export type ThemedProps<V> = styledComponents.ThemedStyledProps<
  React.HTMLProps<V>,
  Theme
>
