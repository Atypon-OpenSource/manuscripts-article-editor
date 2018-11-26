// https://www.styled-components.com/docs/api#typescript

import React from 'react'
import * as styledComponents from 'styled-components'
import {
  black,
  brightSunYellow,
  jellyBeanBlue,
  killarneyGreen,
  manuscriptsBlue,
  manuscriptsGrey,
  punchRed,
  white,
  zestOrange,
} from './colors'

interface Palette {
  [key: string]: {
    [key: string]: string
  }
}

const colors: Palette = {
  primary: {
    grey: manuscriptsGrey,
    blue: manuscriptsBlue,
    white,
    black,
  },

  secondary: {
    orange: zestOrange,
    red: punchRed,
    green: killarneyGreen,
    yellow: brightSunYellow,
  },

  button: {
    primary: jellyBeanBlue,
    danger: punchRed,
  },

  background: {
    primary: jellyBeanBlue,
  },
}

export interface Theme {
  colors: Palette
  fontFamily: string
  radius: number
  spacing: number
}

export type ThemedProps<V> = styledComponents.ThemedStyledProps<
  React.HTMLProps<V>,
  Theme
>

export type ThemedOuterProps<V> = styledComponents.ThemedOuterStyledProps<
  React.HTMLProps<V>,
  Theme
>

export const theme: Theme = {
  colors,
  // tslint:disable-next-line:max-line-length
  fontFamily: `'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  radius: 8,
  spacing: 8,
}

const {
  default: styled,
  css,
  createGlobalStyle,
  ThemeProvider: StyledThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>

export const ThemeProvider: React.FunctionComponent = props => (
  <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
)

export { css, styled }

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  }
`
