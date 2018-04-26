import * as React from 'react'
import { hot } from 'react-hot-loader'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import NotFound from './components/NotFound'
import AccountPageContainer from './containers/AccountPageContainer'
import CollaboratorPageContainer from './containers/CollaboratorPageContainer'
import CollaboratorsPageContainer from './containers/CollaboratorsPageContainer'
import GroupPageContainer from './containers/GroupPageContainer'
import GroupsPageContainer from './containers/GroupsPageContainer'
import HomePageContainer from './containers/HomePageContainer'
import LoginPageContainer from './containers/LoginPageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
// import ManuscriptPageContainer from './containers/ManuscriptPageContainer'
import ManuscriptsPageContainer from './containers/ManuscriptsPageContainer'
import PrivateRoute from './containers/PrivateRoute'
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
    <Route
      path={'/manuscripts'}
      exact={true}
      component={ManuscriptsPageContainer}
    />
    <Route
      path={'/manuscripts/:id'}
      exact={true}
      component={ManuscriptPageContainer}
    />
    <PrivateRoute
      path={'/collaborators'}
      exact={true}
      component={CollaboratorsPageContainer}
    />
    <PrivateRoute
      path={'/collaborators/:id'}
      exact={true}
      component={CollaboratorPageContainer}
    />
    <PrivateRoute
      path={'/groups'}
      exact={true}
      component={GroupsPageContainer}
    />
    <PrivateRoute
      path={'/groups/:id'}
      exact={true}
      component={GroupPageContainer}
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
