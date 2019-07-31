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
import NotFoundPage from './components/NotFoundPage'
import ProjectPageContainer from './components/projects/ProjectPageContainer'
import ProjectsPageContainer from './components/projects/ProjectsPageContainer'
import { RequireLogin } from './components/RequireLogin'
import OptionalUserData from './data/OptionalUserData'
import { TokenData } from './data/TokenData'
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
              ]}
              db={db}
            >
              <Sync collection={'collaborators'} db={db}>
                <OptionalUserData userProfileID={userProfileID!}>
                  {user => (
                    <Switch>
                      <Route
                        path={'/'}
                        exact={true}
                        render={() =>
                          user ? (
                            <Redirect to={'/projects'} />
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
                            <Redirect to={'/'} />
                          ) : (
                            <LoginPageContainer
                              {...props}
                              tokenActions={tokenActions}
                            />
                          )
                        }
                      />

                      <Route
                        path={'/signup'}
                        exact={true}
                        render={props =>
                          user ? (
                            <Redirect to={'/'} />
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
                            <Redirect to={'/'} />
                          ) : (
                            <RecoverPageContainer
                              {...props}
                              tokenActions={tokenActions}
                            />
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
                              Please sign in here at Manuscripts.io first. Your
                              Manuscripts.io account signs you in also to
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
                                    You must sign in first to access the shared
                                    project.
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

                      <Route component={NotFoundPage} />
                    </Switch>
                  )}
                </OptionalUserData>
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
                render={props => (
                  <LoginPageContainer {...props} tokenActions={tokenActions} />
                )}
              />

              <Route
                path={'/signup'}
                exact={true}
                render={props => <SignupPageContainer {...props} />}
              />

              <Route
                path={'/recover'}
                exact={true}
                render={props => (
                  <RecoverPageContainer
                    {...props}
                    tokenActions={tokenActions}
                  />
                )}
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
