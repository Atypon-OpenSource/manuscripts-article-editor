import { colors } from './colors'
import { fontFamily } from './fonts'
import { createGlobalStyle } from './styled-components'
import { Theme } from './types'

export const theme: Theme = {
  colors,
  fontFamily,
  radius: 8,
  spacing: 4,
}

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${fontFamily};
  }
`
