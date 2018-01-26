import * as React from 'react'
import { Route } from 'react-router-dom'
import { Main, Page, Sidebar } from './components/Page'
import HomePageContainer from './containers/HomePageContainer'
import LoginPageContainer from './containers/LoginPageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
import SignupPageContainer from './containers/SignupPageContainer'
import UserContainer from './containers/UserContainer'

const App = () => (
  <Page>
    <Sidebar>
      <UserContainer />
    </Sidebar>

    <Main>
      <Route path={'/'} exact={true} component={HomePageContainer} />
      <Route path={'/login'} component={LoginPageContainer} />
      <Route path={'/logout'} component={LogoutPageContainer} />
      <Route path={'/signup'} component={SignupPageContainer} />
      {/*<PrivateRoute
        path={'/manuscripts'}
        exact={true}
        component={ManuscriptsPage}
      />*/}
    </Main>
  </Page>
)

export default App
