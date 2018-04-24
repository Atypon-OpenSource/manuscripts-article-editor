import 'babel-polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
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
