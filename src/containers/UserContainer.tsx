import * as React from 'react'
import { connect } from 'react-redux'
import { Spinner } from '../components/Spinner'
import { User } from '../components/User'
// import { NavLink } from 'react-router-dom'
import { authenticate } from '../redux/authentication'
import {
  Authentication,
  AuthenticationActions,
  AuthenticationState,
  State,
} from '../types'

interface UserContainerProps {
  authenticate: () => void
  authentication: Authentication
}

class UserContainer extends React.Component<UserContainerProps> {
  public componentDidMount() {
    this.props.authenticate()
  }

  public render() {
    const { authentication } = this.props

    if (authentication.error) {
      return <Spinner color={'red'} />
    }

    if (!authentication.loaded) {
      return <Spinner />
    }

    if (!authentication.user) {
      return null
    }

    return <User user={authentication.user} />
  }
}

export default connect<AuthenticationState, AuthenticationActions>(
  (state: State) => ({
    authentication: state.authentication,
  }),
  {
    authenticate,
  }
)(UserContainer)
