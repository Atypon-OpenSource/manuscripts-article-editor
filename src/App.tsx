import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch } from 'react-router-dom'
import { Main, Page, Sidebar } from './components/Page'
import SidebarNav from './components/SidebarNav'
import CollaboratorsPageContainer from './containers/CollaboratorsPageContainer'
import GroupsPageContainer from './containers/GroupsPageContainer'
import HomePageContainer from './containers/HomePageContainer'
import LoginPageContainer from './containers/LoginPageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
import ManuscriptsPageContainer from './containers/ManuscriptsPageContainer'
import RecoverPageContainer from './containers/RecoverPageContainer'
import SignupPageContainer from './containers/SignupPageContainer'
import UserContainer from './containers/UserContainer'

const App = () => (
  <Page>
    <Sidebar>
      <UserContainer />
      <SidebarNav />
    </Sidebar>

    <Main>
      <Switch>
        <Route path={'/'} exact={true} component={HomePageContainer} />
        <Route path={'/login'} exact={true} component={LoginPageContainer} />
        <Route path={'/logout'} exact={true} component={LogoutPageContainer} />
        <Route path={'/signup'} exact={true} component={SignupPageContainer} />
        <Route
          path={'/recover'}
          exact={true}
          component={RecoverPageContainer}
        />
        <Route path={'/manuscripts'} component={ManuscriptsPageContainer} />
        <Route path={'/collaborators'} component={CollaboratorsPageContainer} />
        <Route path={'/groups'} component={GroupsPageContainer} />
      </Switch>
    </Main>
  </Page>
)

export default hot(module)(App)
