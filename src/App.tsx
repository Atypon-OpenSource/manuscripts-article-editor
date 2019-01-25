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
import InvitationsData from './data/InvitationsData'
import OptionalUserData from './data/OptionalUserData'
import ProjectsData from './data/ProjectsData'
import { TokenData } from './data/TokenData'
import { buildCollaboratorChannels } from './lib/channels'
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
              <ProjectsData>
                {projects => (
                  <InvitationsData>
                    {invitations => (
                      <Sync
                        collection={'collaborators'}
                        channels={buildCollaboratorChannels(
                          userID,
                          projects,
                          invitations
                        )}
                        db={db}
                      >
                        <OptionalUserData userProfileID={userProfileID!}>
                          {(user, userCollection) => (
                            <Switch>
                              <Route
                                path={'/'}
                                exact={true}
                                render={props =>
                                  user ? (
                                    <Redirect to={'/projects'} />
                                  ) : (
                                    <Redirect to={'/signup'} />
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
                                    <ChangePasswordPageContainer {...props} />
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
                                      Please sign in here at Manuscripts.io
                                      first. Your Manuscripts.io account signs
                                      you in also to community.manuscripts.io.
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
                                    <FeedbackPageContainer {...props} />
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
                                          <ProjectPageContainer {...props} />
                                        )}
                                      />

                                      <Route
                                        path={'/projects'}
                                        component={ProjectsPageContainer}
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
                                            You must sign in to access this
                                            project.
                                          </RequireLogin>
                                        )}
                                      />

                                      <Route
                                        path={'/projects'}
                                        render={props => (
                                          <RequireLogin {...props} />
                                        )}
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
                    )}
                  </InvitationsData>
                )}
              </ProjectsData>
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
                render={props => <ChangePasswordPageContainer {...props} />}
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
                component={RequireLogin}
              />

              <Route path={'/profile'} exact={true} component={RequireLogin} />

              <Route path={'/feedback'} component={RequireLogin} />

              <Route path={'/projects'}>
                <Switch>
                  <Route
                    path={'/projects'}
                    exact={true}
                    component={RequireLogin}
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
                render={props => <Redirect to={'/'} />}
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
