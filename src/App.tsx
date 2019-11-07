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

import { ApolloProvider } from '@apollo/react-hooks'
import AppIcon from '@manuscripts/assets/react/AppIcon'
import React from 'react'
import { hot } from 'react-hot-loader'
import { Redirect, Route, Switch } from 'react-router-dom'
import ChangePasswordPageContainer from './components/account/ChangePasswordPageContainer'
import CommunityLoginPageContainer from './components/account/CommunityLoginPageContainer'
import DeleteAccountPageContainer from './components/account/DeleteAccountPageContainer'
import FeedbackPageContainer from './components/account/FeedbackPageContainer'
import LoginPageContainer from './components/account/LoginPageContainer'
import LogoutPageContainer from './components/account/LogoutPageContainer'
import ProfilePageContainer from './components/account/ProfilePageContainer'
import RecoverPageContainer from './components/account/RecoverPageContainer'
import SignupPageContainer from './components/account/SignupPageContainer'
import AcceptEmailInvitationPageContainer from './components/collaboration/AcceptEmailInvitationPageContainer'
import AcceptInvitationURIContainer from './components/collaboration/AcceptProjectInvitationURIPageContainer'
import { DatabaseContext } from './components/DatabaseProvider'
import DeveloperPageContainer from './components/DeveloperPageContainer'
import DiagnosticsPageContainer from './components/diagnostics/DiagnosticsPageContainer'
import { LoadingPage } from './components/Loading'
import NotFoundPage from './components/NotFoundPage'
import ProjectPageContainer from './components/projects/ProjectPageContainer'
import ProjectsPageContainer from './components/projects/ProjectsPageContainer'
import { RequireLogin } from './components/RequireLogin'
import config from './config'
import OptionalUserData from './data/OptionalUserData'
import { TokenData } from './data/TokenData'
import { apolloClient } from './lib/apollo'
import Sync from './sync/Sync'

const App: React.FunctionComponent = () => (
  <DatabaseContext.Consumer>
    {db => (
      <TokenData>
        {({ userID, userProfileID }, tokenActions) =>
          userID ? (
            <Sync
              collection={'user'}
              channels={[
                userID, // invitations
                `${userID}-readwrite`, // profile
                `${userProfileID}-readwrite`, // profile
                `${userID}-projects`, // projects
                `${userID}-libraries`, // libraries
                `${userID}-library-collections`, // library collections
              ]}
              db={db}
              tokenActions={tokenActions}
            >
              <Sync
                collection={'collaborators'}
                db={db}
                tokenActions={tokenActions}
              >
                <ApolloProvider client={apolloClient}>
                  <OptionalUserData
                    userProfileID={userProfileID!}
                    placeholder={
                      <LoadingPage>
                        <AppIcon />
                      </LoadingPage>
                    }
                  >
                    {user => (
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
                          render={props =>
                            user ? (
                              <Redirect to={'/projects'} />
                            ) : (
                              <LoginPageContainer {...props} />
                            )
                          }
                        />

                        <Route
                          path={'/signup'}
                          exact={true}
                          render={props =>
                            user ? (
                              <Redirect to={'/projects'} />
                            ) : config.connect.enabled ? (
                              <Redirect to={'/about/'} />
                            ) : (
                              <SignupPageContainer {...props} />
                            )
                          }
                        />

                        <Route
                          path={'/recover'}
                          exact={true}
                          render={props =>
                            user ? (
                              <Redirect to={'/projects'} />
                            ) : (
                              <RecoverPageContainer {...props} />
                            )
                          }
                        />

                        <Route
                          path={'/change-password'}
                          exact={true}
                          render={props =>
                            user ? (
                              <ChangePasswordPageContainer
                                {...props}
                                tokenActions={tokenActions}
                              />
                            ) : (
                              <RequireLogin {...props} />
                            )
                          }
                        />

                        <Route
                          path={'/community'}
                          exact={true}
                          render={props =>
                            user ? (
                              <CommunityLoginPageContainer {...props} />
                            ) : (
                              <RequireLogin {...props}>
                                Please sign in here at Manuscripts.io first.
                                Your Manuscripts.io account signs you in also to
                                community.manuscripts.io.
                              </RequireLogin>
                            )
                          }
                        />

                        <Route
                          path={'/delete-account'}
                          exact={true}
                          render={props =>
                            user ? (
                              <DeleteAccountPageContainer
                                tokenActions={tokenActions}
                                {...props}
                              />
                            ) : (
                              <RequireLogin {...props} />
                            )
                          }
                        />

                        <Route
                          path={'/profile'}
                          exact={true}
                          render={props =>
                            user ? (
                              <ProfilePageContainer {...props} />
                            ) : (
                              <RequireLogin {...props} />
                            )
                          }
                        />

                        <Route
                          path={'/feedback'}
                          render={props =>
                            user ? (
                              <FeedbackPageContainer
                                tokenActions={tokenActions}
                                {...props}
                              />
                            ) : (
                              <RequireLogin {...props} />
                            )
                          }
                        />

                        <Route
                          path={'/projects'}
                          render={props =>
                            user ? (
                              <Switch {...props}>
                                <Route
                                  path={
                                    '/projects/:projectID/invitation/:invitationToken'
                                  }
                                  component={AcceptInvitationURIContainer}
                                />

                                <Route
                                  path={'/projects/:projectID'}
                                  render={props => (
                                    <ProjectPageContainer
                                      {...props}
                                      tokenActions={tokenActions}
                                      key={props.match.params.projectID}
                                    />
                                  )}
                                />

                                <Route
                                  path={'/projects'}
                                  render={props => (
                                    <ProjectsPageContainer
                                      {...props}
                                      tokenActions={tokenActions}
                                      errorMessage={
                                        props.location.state
                                          ? props.location.state.errorMessage
                                          : null
                                      }
                                    />
                                  )}
                                />
                              </Switch>
                            ) : (
                              <Switch {...props}>
                                <Route
                                  path={
                                    '/projects/:projectID/invitation/:invitationToken'
                                  }
                                  render={props => (
                                    <RequireLogin {...props}>
                                      You must sign in first to access the
                                      shared project.
                                    </RequireLogin>
                                  )}
                                />

                                <Route
                                  path={'/projects/:projectID'}
                                  render={props => (
                                    <RequireLogin {...props}>
                                      You must sign in to access this project.
                                    </RequireLogin>
                                  )}
                                />

                                <Route
                                  path={'/projects'}
                                  render={props => <RequireLogin {...props} />}
                                />
                              </Switch>
                            )
                          }
                        />

                        <Route
                          path={'/invitation'}
                          exact={true}
                          component={AcceptEmailInvitationPageContainer}
                        />

                        <Route
                          path={'/logout'}
                          exact={true}
                          render={props => (
                            <LogoutPageContainer
                              {...props}
                              tokenActions={tokenActions}
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
                    )}
                  </OptionalUserData>
                </ApolloProvider>
              </Sync>
            </Sync>
          ) : (
            <Switch>
              <Route
                path={'/'}
                exact={true}
                render={() => <Redirect to={'/signup'} />}
              />

              <Route
                path={'/login'}
                exact={true}
                render={props => <LoginPageContainer {...props} />}
              />

              <Route
                path={'/signup'}
                exact={true}
                render={props =>
                  config.connect.enabled ? (
                    <Redirect to={'/about/'} />
                  ) : (
                    <SignupPageContainer {...props} />
                  )
                }
              />

              <Route
                path={'/recover'}
                exact={true}
                render={props => <RecoverPageContainer {...props} />}
              />

              <Route
                path={'/change-password'}
                exact={true}
                render={props => (
                  <RequireLogin {...props}>
                    You must sign in first to change your password.
                  </RequireLogin>
                )}
              />

              <Route
                path={'/community'}
                exact={true}
                render={props => (
                  <RequireLogin {...props}>
                    Please sign in here at Manuscripts.io first. Your
                    Manuscripts.io account signs you in also to
                    community.manuscripts.io.
                  </RequireLogin>
                )}
              />

              <Route
                path={'/delete-account'}
                exact={true}
                render={props => (
                  <RequireLogin {...props}>
                    You must sign in first to delete your account.
                  </RequireLogin>
                )}
              />

              <Route path={'/profile'} exact={true} component={RequireLogin} />

              <Route
                path={'/feedback'}
                render={props => (
                  <RequireLogin {...props}>
                    You must sign in first.
                  </RequireLogin>
                )}
              />

              <Route path={'/projects'}>
                <Switch>
                  <Route
                    path={'/projects'}
                    exact={true}
                    render={props => (
                      <RequireLogin {...props}>
                        You must sign in first.
                      </RequireLogin>
                    )}
                  />

                  <Route
                    path={'/projects/:projectID/invitation/:invitationToken'}
                    exact={true}
                    render={props => (
                      <RequireLogin {...props}>
                        You must sign in first to access the shared project.
                      </RequireLogin>
                    )}
                  />

                  <Route
                    path={'/projects/:projectID/collaborators/add'}
                    render={props => (
                      <RequireLogin {...props}>
                        You must sign in first.
                      </RequireLogin>
                    )}
                  />

                  <Route
                    path={'/projects/:projectID/collaborators'}
                    render={props => (
                      <RequireLogin {...props}>
                        You must sign in first.
                      </RequireLogin>
                    )}
                  />

                  <Route
                    path={'/projects/:projectID'}
                    render={props => (
                      <RequireLogin {...props}>
                        You must sign in to access this project.
                      </RequireLogin>
                    )}
                  />
                </Switch>
              </Route>

              <Route
                path={'/invitation'}
                exact={true}
                component={AcceptEmailInvitationPageContainer}
              />

              <Route
                path={'/logout'}
                exact={true}
                render={() => <Redirect to={'/'} />}
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
      </TokenData>
    )}
  </DatabaseContext.Consumer>
)

export default hot(module)(App)
