import React from 'react'
import { Redirect } from 'react-router-dom'
import { IconBar, Main, Page } from '../components/Page'
import { logout } from '../lib/api'
import { UserProps, withUser } from '../store/UserProvider'
import SidebarContainer from './SidebarContainer'

class LogoutPageContainer extends React.Component<UserProps> {
  public componentDidMount() {
    logout()
      .then(() => {
        this.props.user.fetch()
      })
      .catch(() => {
        // TODO: handle appropriately
      })
  }

  public render() {
    const { user } = this.props

    if (!user.data) {
      return <Redirect to={'/'} />
    }

    return (
      <Page>
        <IconBar />
        <SidebarContainer />

        <Main>
          <div>Signing out…</div>
        </Main>
      </Page>
    )
  }
}

export default withUser(LogoutPageContainer)
