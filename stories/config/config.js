import { addDecorator, configure } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Story } from '../components/Story'
import { ThemeProvider } from '../../src/theme'
import IntlProvider from '../../src/store/IntlProvider'

addDecorator(story => (
  <IntlProvider>
    <ThemeProvider>
      <MemoryRouter initialEntries={['/']}>
        <Story>
          <div>{story()}</div>
        </Story>
      </MemoryRouter>
    </ThemeProvider>
  </IntlProvider>
))

const req = require.context('..', true, /\.stories\.tsx/)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module)
