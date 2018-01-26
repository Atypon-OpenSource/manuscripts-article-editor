import * as React from 'react'
import { connect } from 'react-redux'
import HomePage from '../components/HomePage'
import { Spinner } from '../components/Spinner'
import { AuthenticationState, State } from '../types'

class HomePageContainer extends React.Component<AuthenticationState> {
  public render() {
    const { authentication } = this.props

    if (authentication.error) {
      return <Spinner color={'red'} />
    }

    if (!authentication.loaded) {
      return <Spinner color={'black'} />
    }

    return <HomePage user={authentication.user} />
  }
}

export default connect((state: State) => ({
  authentication: state.authentication,
}))(HomePageContainer)
