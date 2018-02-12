import * as React from 'react'
import { connect } from 'react-redux'
import { Spinner } from '../components/Spinner'
import { User } from '../components/User'
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'

class UserContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  public componentDidMount() {
    /* tslint:disable-next-line:no-any */
    this.props.dispatch<any>(authenticate())
  }

  public render() {
    const { authentication } = this.props

    if (authentication.error) {
      return <Spinner color={'red'} />
    }

    if (!authentication.loaded) {
      return <Spinner />
    }

    return <User user={authentication.user} />
  }
}

export default connect<AuthenticationStateProps, AuthenticationDispatchProps>(
  (state: ApplicationState) => ({
    authentication: state.authentication,
  })
)(UserContainer)
