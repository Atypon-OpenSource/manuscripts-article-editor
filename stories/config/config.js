import { addDecorator, configure } from '@storybook/react'
import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Story } from '../components/Story'
import { ThemeProvider } from '../../src/theme'

addDecorator(story => (
  <ThemeProvider>
    <MemoryRouter initialEntries={['/']}>
      <Story>
        <div>{story()}</div>
      </Story>
    </MemoryRouter>
  </ThemeProvider>
))

const req = require.context('..', true, /\.stories\.tsx/)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module)
