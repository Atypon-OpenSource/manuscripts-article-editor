/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import DatabaseProvider from './components/DatabaseProvider'
import IntlProvider from './components/IntlProvider'
import { ModalProvider } from './components/ModalProvider'
import { databaseCreator } from './lib/db'
import HTML5Backend from './lib/dnd'
import './lib/fonts'
import './lib/sentry'
import './lib/service-worker'
import { GlobalStyle } from './theme/theme'
import { ThemeProvider } from './theme/ThemeProvider'

ReactDOM.render(
  <IntlProvider>
    <DragDropContextProvider backend={HTML5Backend}>
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
    </DragDropContextProvider>
  </IntlProvider>,
  document.getElementById('root')
)
