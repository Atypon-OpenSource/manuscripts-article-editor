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
import DeveloperPageContainer from './components/DeveloperPageContainer'
import NotFoundPage from './components/NotFoundPage'
import ProjectPageContainer from './components/projects/ProjectPageContainer'
import ProjectsPageContainer from './components/projects/ProjectsPageContainer'
import { RequireLogin } from './components/RequireLogin'
import UserOrNullData from './data/UserOrNullData'
import { getCurrentUserId } from './lib/user'

const App = () => (
  <UserOrNullData userID={getCurrentUserId()}>
    {user => (
      <Switch>
        <Route path={'/'} exact={true}>
          {user ? <Redirect to={'/projects'} /> : <Redirect to={'/signup'} />}
        </Route>

        <Route path={'/login'} exact={true}>
          {props =>
            user ? <Redirect to={'/'} /> : <LoginPageContainer {...props} />
          }
        </Route>

        <Route path={'/signup'} exact={true}>
          {props =>
            user ? <Redirect to={'/'} /> : <SignupPageContainer {...props} />
          }
        </Route>

        <Route path={'/recover'} exact={true}>
          {props =>
            user ? <Redirect to={'/'} /> : <RecoverPageContainer {...props} />
          }
        </Route>

        <Route path={'/change-password'} exact={true}>
          {props =>
            user ? (
              <ChangePasswordPageContainer {...props} />
            ) : (
              <RequireLogin {...props} />
            )
          }
        </Route>

        <Route path={'/community'} exact={true}>
          {props =>
            user ? (
              <CommunityLoginPageContainer {...props} />
            ) : (
              <RequireLogin {...props}>
                Please sign in here at Manuscripts.io first. Your Manuscripts.io
                account signs you in also to community.manuscripts.io.
              </RequireLogin>
            )
          }
        </Route>

        <Route path={'/delete-account'} exact={true}>
          {props =>
            user ? <DeleteAccountPageContainer /> : <RequireLogin {...props} />
          }
        </Route>

        <Route path={'/profile'} exact={true}>
          {props =>
            user ? (
              <ProfilePageContainer {...props} />
            ) : (
              <RequireLogin {...props} />
            )
          }
        </Route>

        <Route path={'/projects'} exact={true}>
          {props =>
            user ? <ProjectsPageContainer /> : <RequireLogin {...props} />
          }
        </Route>

        <Route
          path={'/projects/:projectID/invitation/:invitationToken'}
          exact={true}
        >
          {props =>
            user ? (
              <AcceptInvitationURIContainer {...props} />
            ) : (
              <RequireLogin {...props}>
                You must sign in first to access the shared project.
              </RequireLogin>
            )
          }
        </Route>

        <Route path={'/projects/:projectID'}>
          {props =>
            user ? (
              <ProjectPageContainer {...props} />
            ) : (
              <RequireLogin {...props}>
                You must sign in to access this project.
              </RequireLogin>
            )
          }
        </Route>

        <Route path={'/feedback'}>
          {props =>
            user ? (
              <FeedbackPageContainer {...props} />
            ) : (
              <RequireLogin {...props} />
            )
          }
        </Route>

        <Route
          path={'/invitation'}
          exact={true}
          component={AcceptEmailInvitationPageContainer}
        />

        <Route path={'/logout'} exact={true} component={LogoutPageContainer} />

        <Route
          path={'/developer'}
          exact={true}
          component={DeveloperPageContainer}
        />

        <Route component={NotFoundPage} />
      </Switch>
    )}
  </UserOrNullData>
)

export default hot(module)(App)
