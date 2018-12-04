import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ModalProvider } from './components/ModalProvider'
import './lib/fonts'
import './lib/sentry'
import './lib/service-worker'
import { StoreProviders } from './store'
import { ThemeProvider } from './theme'

ReactDOM.render(
  <StoreProviders>
    <ThemeProvider>
      <BrowserRouter>
        <ModalProvider>
          <App />
        </ModalProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StoreProviders>,
  document.getElementById('root')
)
