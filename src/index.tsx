import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ModalProvider } from './components/ModalProvider'
import './lib/fonts'
import './lib/sentry'
import './lib/service-worker'
import IntlProvider from './store/IntlProvider'
import ModelsProvider from './store/ModelsProvider'
import { ThemeProvider } from './theme'

ReactDOM.render(
  <ModelsProvider>
    <IntlProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ModalProvider>
            <App />
          </ModalProvider>
        </BrowserRouter>
      </ThemeProvider>
    </IntlProvider>
  </ModelsProvider>,
  document.getElementById('root')
)
