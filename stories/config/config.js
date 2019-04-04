const { addDecorator, configure } = require('@storybook/react')
const React = require('react')
const { DragDropContextProvider } = require('react-dnd')
const HTML5Backend = require('react-dnd-html5-backend').default
const { MemoryRouter } = require('react-router-dom')
const { Story } = require('../components/Story')
const { GlobalStyle } = require('../../src/theme/theme')
const { ThemeProvider } = require('../../src/theme/ThemeProvider')
const IntlProvider = require('../../src/components/IntlProvider').default
const { ModalProvider } = require('../../src/components/ModalProvider')
const { databaseCreator } = require('../../src/lib/__mocks__/adapter')

addDecorator(story => (
  <DragDropContextProvider backend={HTML5Backend}>
    <IntlProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/']}>
            <ModalProvider>
              <Story>
                <GlobalStyle suppressMultiMountWarning />
                <div>{story()}</div>
              </Story>
            </ModalProvider>
          </MemoryRouter>
        </ThemeProvider>
    </IntlProvider>
  </DragDropContextProvider>
))

const req = require.context('..', true, /\.stories\.tsx/)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module)
