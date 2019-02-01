import * as styledComponents from 'styled-components'
import { Theme } from './types'

const {
  default: styled,
  css,
  createGlobalStyle,
  ThemeProvider: StyledThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>

export { createGlobalStyle, css, styled, StyledThemeProvider }
