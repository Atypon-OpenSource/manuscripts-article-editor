/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import React, { useEffect, useMemo, useState } from 'react'
import type { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch } from 'react-router-dom'

import LoginPageContainer from './components/account/LoginPageContainer'
import { Frontmatter } from './components/Frontmatter'
import config from './config'
import type { RouteLocationState } from './types/router-state'

import { useStore, addDataSource } from './store'
import ManuscriptEditor from './components/projects/lean-workflow/ManuscriptEditor'

const DeveloperPageContainer = React.lazy(
  () =>
    import(
      /* webpackChunkName:"developer-page" */ './components/DeveloperPageContainer'
    )
)

const DiagnosticsPageContainer = React.lazy(
  () =>
    import(
      /* webpackChunkName:"diagnostics-page" */ './components/diagnostics/DiagnosticsPageContainer'
    )
)

const NotFoundPage = React.lazy(
  () =>
    import(/* webpackChunkName:"not-found-page" */ './components/NotFoundPage')
)

export const TestComponent = () => {
  useEffect(() => {
    console.log('TEST COMPONENT MOUNTED')
  }, [])

  const [state] = useStore()

  console.log('======================== STATE: ========================')
  console.log(state)

  return <h1>Testing...</h1>
}

const OnlyEditor = () => {
  const [state] = useStore()

  const { user, userID, tokenActions, manuscriptID, projectID } = state

  return userID ? (
    <Switch>
      <Route
        path={'/'}
        exact={true}
        render={() =>
          user ? (
            <Redirect to={'/projects'} />
          ) : config.connect.enabled ? (
            <Redirect
              to={{
                pathname: `/login`,
                state: {
                  errorMessage: 'missing-user-profile',
                },
              }}
            />
          ) : (
            <Redirect
              to={{
                pathname: `/signup`,
                state: {
                  errorMessage: 'missing-user-profile',
                },
              }}
            />
          )
        }
      />

      <Route
        path={'/login'}
        exact={true}
        render={(
          props: RouteComponentProps<
            Record<string, never>,
            Record<string, never>,
            RouteLocationState
          >
        ) =>
          user ? (
            <Redirect to={'/projects'} />
          ) : (
            <Frontmatter>
              <LoginPageContainer {...props} />
            </Frontmatter>
          )
        }
      />

      <Route
        path={'/projects/:projectID/manuscripts/:manuscriptID'}
        render={(props) => (
          <ManuscriptEditor
            {...props}
            tokenActions={tokenActions}
            projectID={props.match.params.projectID}
            manuscriptID={props.match.params.projectID}
          />
        )}
      />

      <Route
        path={'/developer'}
        exact={true}
        component={DeveloperPageContainer}
      />

      <Route
        path={'/diagnostics'}
        exact={true}
        component={DiagnosticsPageContainer}
      />

      <Route component={NotFoundPage} />
    </Switch>
  ) : (
    <Switch>
      <Route
        path={'/login'}
        exact={true}
        render={(
          props: RouteComponentProps<
            Record<string, never>,
            Record<string, never>,
            RouteLocationState
          >
        ) => <LoginPageContainer {...props} />}
      />

      <Route
        path={'/developer'}
        exact={true}
        component={DeveloperPageContainer}
      />

      <Route component={NotFoundPage} />
    </Switch>
  )
}

export default OnlyEditor
