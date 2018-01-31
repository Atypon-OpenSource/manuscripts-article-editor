import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { logout } from '../lib/api'
import { authenticate } from '../redux/authentication'
import {
  AuthenticationActions,
  AuthenticationProps,
  AuthenticationState,
  State,
} from '../types'

class LogoutPageContainer extends React.Component<AuthenticationProps> {
  public componentDidMount() {
    logout()
      .then(() => {
        this.props.authenticate()
      })
      .catch(() => {
        // TODO: handle appropriately
      })
  }

  public render() {
    const { authentication } = this.props

    if (!authentication.user) {
      return <Redirect to={'/'} />
    }

    return <div>Signing out…</div>
  }
}

export default connect<AuthenticationState, AuthenticationActions>(
  (state: State) => ({
    authentication: state.authentication,
  }),
  {
    authenticate,
  }
)(LogoutPageContainer)
