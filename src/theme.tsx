import * as React from 'react'
import { ThemeProvider as Provider } from 'styled-components'
import { ChildrenProps } from './types'

const theme = {
  main: 'green',
}

export const ThemeProvider = (props: ChildrenProps) => (
  <Provider theme={theme}>{props.children}</Provider>
)
