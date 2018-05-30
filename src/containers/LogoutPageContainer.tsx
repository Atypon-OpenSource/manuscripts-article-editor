import React from 'react'
// import { Redirect } from 'react-router-dom'
import { Main, Page } from '../components/Page'
import { logout } from '../lib/api'
import { removeDB } from '../lib/rxdb'
import { UserProps, withUser } from '../store/UserProvider'

class LogoutPageContainer extends React.Component<UserProps> {
  public async componentDidMount() {
    try {
      await logout()
      await removeDB()
    } catch (e) {
      // TODO: handle logout failure
      await removeDB()
    }

    // TODO: clear localStorage?

    // TODO: something better
    window.location.href = '/'
  }

  public render() {
    // const { user } = this.props
    //
    // if (!user.loaded) {
    //   return null
    // }
    //
    // if (!user.data) {
    //   return <Redirect to={'/'} />
    // }

    return (
      <Page>
        <Main>
          <div>Signing out…</div>
        </Main>
      </Page>
    )
  }
}

export default withUser(LogoutPageContainer)
