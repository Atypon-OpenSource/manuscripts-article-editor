import { addDecorator, configure } from '@storybook/react'
import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Page } from '../../src/components/Page'
import { ThemeProvider } from '../../src/theme'

addDecorator(story => (
  <ThemeProvider>
    <MemoryRouter initialEntries={['/']}>
      <Page>
        <div>{story()}</div>
      </Page>
    </MemoryRouter>
  </ThemeProvider>
))

const req = require.context('..', true, /\.stories\.tsx/)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module)
