require('@babel/polyfill')
const { addDecorator, configure } = require('@storybook/react')
const React = require('react')
const { MemoryRouter } = require('react-router-dom')
const { Story } = require('../components/Story')
const { GlobalStyle, ThemeProvider } = require('../../src/theme')
const IntlProvider = require('../../src/store/IntlProvider').default

addDecorator(story => (
  <IntlProvider>
    <ThemeProvider>
      <MemoryRouter initialEntries={['/']}>
        <Story>
          <GlobalStyle />
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
