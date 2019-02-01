import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import DatabaseProvider from './components/DatabaseProvider'
import IntlProvider from './components/IntlProvider'
import { ModalProvider } from './components/ModalProvider'
import { databaseCreator } from './lib/db'
import './lib/fonts'
import './lib/sentry'
import './lib/service-worker'
import { GlobalStyle } from './theme/theme'
import { ThemeProvider } from './theme/ThemeProvider'

ReactDOM.render(
  <IntlProvider>
    <ThemeProvider>
      <BrowserRouter>
        <DatabaseProvider databaseCreator={databaseCreator}>
          <ModalProvider>
            <GlobalStyle />
            <App />
          </ModalProvider>
        </DatabaseProvider>
      </BrowserRouter>
    </ThemeProvider>
  </IntlProvider>,
  document.getElementById('root')
)
