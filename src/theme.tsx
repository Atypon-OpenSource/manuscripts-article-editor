// https://www.styled-components.com/docs/api#typescript

import * as React from 'react'
import * as styledComponents from 'styled-components'

export interface ThemeInterface {
  active: string
  backgroundColor: string
  borderRadius: string
  color: string
  fontFamily: string
  padding: string
  primary: string
  sidebarBackgroundColor: string
}

export const theme = {
  active: '#274c76',
  backgroundColor: '#fff',
  borderRadius: '8px',
  color: '#000',
  // tslint:disable-next-line:max-line-length
  fontFamily: `'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  padding: '10px',
  primary: '#4489D8',
  sidebarBackgroundColor: '#f2f8ff',
}

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider: StyledThemeProvider,
  /* tslint:disable-next-line:no-unnecessary-type-assertion */
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeInterface
>

export const ThemeProvider: React.SFC = props => (
  <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
)

export { css, injectGlobal, keyframes, styled }
