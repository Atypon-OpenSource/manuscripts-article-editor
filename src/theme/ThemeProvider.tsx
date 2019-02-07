import React from 'react'
import { ThemeProvider as StyledThemeProvider } from './styled-components'
import { theme } from './theme'

export const ThemeProvider: React.FunctionComponent<{
  children: React.ReactChild
}> = props => (
  <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
)
