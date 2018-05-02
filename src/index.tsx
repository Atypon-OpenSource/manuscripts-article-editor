import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './lib/sentry'
import { StoreProviders } from './store'
import { ThemeProvider } from './theme'

ReactDOM.render(
  <StoreProviders>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StoreProviders>,
  document.getElementById('root')
)
