import React from 'react'
import { hot } from 'react-hot-loader'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import NotFound from './components/NotFound'
import AccountPageContainer from './containers/AccountPageContainer'
import HomePageContainer from './containers/HomePageContainer'
import LibraryPageContainer from './containers/LibraryPageContainer'
import LoginPageContainer from './containers/LoginPageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
// import ManuscriptPageContainer from './containers/ManuscriptPageContainer'
import PreferencesPageContainer from './containers/PreferencesPageContainer'
import PrivateRoute from './containers/PrivateRoute'
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
      path={'/account'}
      exact={true}
      component={AccountPageContainer}
    />
    <PrivateRoute
      path={'/preferences'}
      exact={true}
      component={PreferencesPageContainer}
    />
    <PrivateRoute
      path={'/library'}
      exact={true}
      component={LibraryPageContainer}
    />
    <PrivateRoute
      path={'/projects'}
      exact={true}
      component={ProjectsPageContainer}
    />
    <PrivateRoute
      path={'/projects/:id'}
      exact={true}
      component={ProjectPageContainer}
    />
    <PrivateRoute
      path={'/projects/:project/manuscripts/:id'}
      exact={true}
      component={ManuscriptPageContainer}
    />
    <PrivateRoute
      path={'/logout'}
      exact={true}
      component={LogoutPageContainer}
    />
    <Route path={'/welcome'} exact={true} component={WelcomePageContainer} />
    <Route component={NotFound} />
  </Switch>
)

export default hot(module)(App)
