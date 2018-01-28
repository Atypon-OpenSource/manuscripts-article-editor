import * as React from 'react'
import { ThemeProvider as Provider } from 'styled-components'
import { ChildrenProps } from './types'

// tslint:disable:max-line-length

const theme = {
  backgroundColor: '#3f566f',
  color: '#fff',
  fontFamily: `'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  padding: '10px',
}

export const ThemeProvider = (props: ChildrenProps) => (
  <Provider theme={theme}>{props.children}</Provider>
)
