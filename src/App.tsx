import React from 'react'
import { hot } from 'react-hot-loader'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import NotFound from './components/NotFound'
import AcceptEmailInvitationContainer from './containers/AcceptEmailInvitationContainer'
import AcceptInvitationURIContainer from './containers/AcceptProjectInvitationURIContainer'
import AddCollaboratorsPageContainer from './containers/AddCollaboratorsPageContainer'
import ChangePasswordPageContainer from './containers/ChangePasswordPageContainer'
import CollaboratorsPageContainer from './containers/CollaboratorsPageContainer'
import CommunityLoginPageContainer from './containers/CommunityLoginContainer'
import DeleteAccountPageContainer from './containers/DeleteAccountPageContainer'
import DeveloperPageContainer from './containers/DeveloperPageContainer'
import HomePageContainer from './containers/HomePageContainer'
import LibraryPageContainer from './containers/LibraryPageContainer'
import LoginPageContainer from './containers/LoginPageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
// import ManuscriptPageContainer from './containers/ManuscriptPageContainer'
// import PreferencesPageContainer from './containers/PreferencesPageContainer'
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
      path={'/community'}
      exact={true}
      component={CommunityLoginPageContainer}
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
    {/*<PrivateRoute
      path={'/preferences'}
      exact={true}
      component={PreferencesPageContainer}
    />*/}
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
      path={'/projects/:projectID/invitation/:invitationToken'}
      exact={true}
      component={AcceptInvitationURIContainer}
      message={'You must sign in first to access the shared project.'}
    />
    <PrivateRoute
      path={'/projects/:projectID/library'}
      exact={true}
      component={LibraryPageContainer}
    />
    <PrivateRoute
      path={'/projects/:projectID/collaborators'}
      exact={true}
      component={CollaboratorsPageContainer}
    />
    <PrivateRoute
      path={'/projects/:projectID/collaborators/add'}
      exact={true}
      component={AddCollaboratorsPageContainer}
    />
    <Route
      path={'/invitation'}
      exact={true}
      component={AcceptEmailInvitationContainer}
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
