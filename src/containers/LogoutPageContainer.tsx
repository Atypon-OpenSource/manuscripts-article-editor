import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { logout } from '../lib/api'
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'

class LogoutPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  public componentDidMount() {
    logout()
      .then(() => {
        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
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

export default connect<AuthenticationStateProps, AuthenticationDispatchProps>(
  (state: ApplicationState) => ({
    authentication: state.authentication,
  })
)(LogoutPageContainer)
