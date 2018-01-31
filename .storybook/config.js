import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { configure, addDecorator } from '@storybook/react'
import { ThemeProvider } from '../src/theme'
import '../src/index.css'

const req = require.context('../stories', true, /\.stories\.tsx/)

addDecorator(story => (
  <ThemeProvider>
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  </ThemeProvider>
))

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module)
