import React from 'react'
import { hot } from 'react-hot-loader'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
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
import AddCollaboratorsPageContainer from './components/collaboration/AddCollaboratorsPageContainer'
import CollaboratorsPageContainer from './components/collaboration/CollaboratorsPageContainer'
import DeveloperPageContainer from './components/DeveloperPageContainer'
import HomePageContainer from './components/HomePageContainer'
import LibraryPageContainer from './components/library/LibraryPageContainer'
import { LoadableSpinner } from './components/LoadableSpinner'
import NotFoundPage from './components/NotFoundPage'
// import ManuscriptPageContainer from './containers/ManuscriptPageContainer'
// import PreferencesPageContainer from './containers/PreferencesPageContainer'
import PrivateRoute from './components/PrivateRoute'
import ProjectPageContainer from './components/projects/ProjectPageContainer'
import ProjectsPageContainer from './components/projects/ProjectsPageContainer'
import WelcomePageContainer from './components/WelcomePageContainer'

const ManuscriptPageContainer = Loadable({
  delay: 500,
  loader: () =>
    import(/* webpackChunkName:"manuscript" */ './components/projects/ManuscriptPageContainer'),
  loading: LoadableSpinner,
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
      message={
        'Please sign in here at Manuscripts.io first. Your Manuscripts.io account signs you in also to community.manuscripts.io.'
      }
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
    <PrivateRoute
      path={'/feedback'}
      exact={true}
      component={FeedbackPageContainer}
    />
    <Route
      path={'/invitation'}
      exact={true}
      component={AcceptEmailInvitationPageContainer}
    />
    <Route path={'/logout'} exact={true} component={LogoutPageContainer} />
    <Route path={'/welcome'} exact={true} component={WelcomePageContainer} />
    <Route
      path={'/developer'}
      exact={true}
      component={DeveloperPageContainer}
    />
    <Route component={NotFoundPage} />
  </Switch>
)

export default hot(module)(App)
