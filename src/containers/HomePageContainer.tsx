import * as React from 'react'
import { connect } from 'react-redux'
import HomePage from '../components/HomePage'
import { Spinner } from '../components/Spinner'
import { AuthenticationStateProps } from '../store/authentication/types'
import { ApplicationState } from '../store/types'

class HomePageContainer extends React.Component<AuthenticationStateProps> {
  public render() {
    const { authentication } = this.props

    if (authentication.error) {
      return <Spinner color={'red'} />
    }

    if (!authentication.loaded) {
      return <Spinner color={'black'} />
    }

    return <HomePage />
  }
}

export default connect<AuthenticationStateProps>((state: ApplicationState) => ({
  authentication: state.authentication,
}))(HomePageContainer)
