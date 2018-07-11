import React from 'react'
import { hot } from 'react-hot-loader'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import NotFound from './components/NotFound'
import AcceptInvitationContainer from './containers/AcceptInvitationContainer'
import ChangePasswordPageContainer from './containers/ChangePasswordPageContainer'
import DeleteAccountPageContainer from './containers/DeleteAccountPageContainer'
import DeveloperPageContainer from './containers/DeveloperPageContainer'
import HomePageContainer from './containers/HomePageContainer'
import LibraryPageContainer from './containers/LibraryPageContainer'
import LoginPageContainer from './containers/LoginPageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
// import ManuscriptPageContainer from './containers/ManuscriptPageContainer'
import PreferencesPageContainer from './containers/PreferencesPageContainer'
import PrivateRoute from './containers/PrivateRoute'
import ProfilePageContainer from './containers/ProfilePageContainer'
import ProjectPageContainer from './containers/ProjectPageContainer'
import ProjectsPageContainer from './containers/ProjectsPageContainer'
import RecoverPageContainer from './containers/RecoverPageContainer'
import SignupPageContainer from './containers/SignupPageContainer'
import WelcomePageContainer from './containers/WelcomePageContainer'
import Spinner from './icons/spinner'

const ManuscriptPageContainer = Loadable({
  loader: () =>
    import(/* webpackChunkName:"manuscript" */ './containers/ManuscriptPageContainer'),
  loading: Spinner,
})

const App = () => (
  <Switch>
    <Route path={'/'} exact={true} component={HomePageContainer} />
    <Route path={'/login'} exact={true} component={LoginPageContainer} />
    <Route path={'/signup'} exact={true} component={SignupPageContainer} />
    <Route path={'/recover'} exact={true} component={RecoverPageContainer} />
    <PrivateRoute
      path={'/change-password'}
      exact={true}
      component={ChangePasswordPageContainer}
    />
    <PrivateRoute
      path={'/delete-account'}
      exact={true}
      component={DeleteAccountPageContainer}
    />
    <PrivateRoute
      path={'/profile'}
      exact={true}
      component={ProfilePageContainer}
    />
    <PrivateRoute
      path={'/preferences'}
      exact={true}
      component={PreferencesPageContainer}
    />
    <PrivateRoute
      path={'/projects'}
      exact={true}
      component={ProjectsPageContainer}
    />
    <PrivateRoute
      path={'/projects/:projectID'}
      exact={true}
      component={ProjectPageContainer}
    />
    <PrivateRoute
      path={'/projects/:projectID/manuscripts/:manuscriptID'}
      exact={true}
      component={ManuscriptPageContainer}
    />
    <PrivateRoute
      path={'/projects/:project/invitation/:invitationToken'}
      exact={true}
      component={AcceptInvitationContainer}
    />
    <PrivateRoute
      path={'/projects/:projectID/library'}
      exact={true}
      component={LibraryPageContainer}
    />
    <Route path={'/logout'} exact={true} component={LogoutPageContainer} />
    <Route path={'/welcome'} exact={true} component={WelcomePageContainer} />
    <Route
      path={'/developer'}
      exact={true}
      component={DeveloperPageContainer}
    />
    <Route component={NotFound} />
  </Switch>
)

export default hot(module)(App)
