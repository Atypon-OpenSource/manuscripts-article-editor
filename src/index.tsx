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
import ReactDOM from 'react-dom'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import IntlProvider from './components/IntlProvider'
import './lib/fonts'
import './lib/sentry'
import tokenHandler from './lib/token'
import { ThemeProvider } from './theme/ThemeProvider'

const LandingPage = React.lazy(() => import('./components/landing/LandingPage'))
const Main = React.lazy(() => import('./Main'))

ReactDOM.render(
  <IntlProvider>
    <ThemeProvider>
      <React.Suspense fallback={null}>
        <BrowserRouter>
          <Switch>
            <Route
              path={'/intro'}
              exact={true}
              render={() => <LandingPage />}
            />
            <Redirect
              from={'/'}
              exact={true}
              to={tokenHandler.get() ? '/projects' : '/intro'}
            />
            <Route path={'/'} render={() => <Main />} />
          </Switch>
        </BrowserRouter>
      </React.Suspense>
    </ThemeProvider>
  </IntlProvider>,
  document.getElementById('root')
)
