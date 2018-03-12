import * as React from 'react'
import { connect } from 'react-redux'
import { Spinner } from '../components/Spinner'
import { UserInfo, UserLink } from '../components/UserInfo'
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'

interface UserContainerState {
  isOpen: boolean
}

class UserContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  public state: UserContainerState = {
    isOpen: false,
  }

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

    if (!authentication.user) {
      return <UserLink to={'/login'}>Sign in</UserLink>
    }

    return (
      <UserInfo
        user={authentication.user}
        isOpen={this.state.isOpen}
        toggleOpen={this.toggleOpen}
      />
    )
  }

  private toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
}

export default connect<AuthenticationStateProps, AuthenticationDispatchProps>(
  (state: ApplicationState) => ({
    authentication: state.authentication,
  })
)(UserContainer)
