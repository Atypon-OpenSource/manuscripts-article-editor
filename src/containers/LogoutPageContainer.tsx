import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { logout } from '../lib/api'
import { UserProps, withUser } from '../store/UserProvider'

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

    return <div>Signing out…</div>
  }
}

export default withUser(LogoutPageContainer)
