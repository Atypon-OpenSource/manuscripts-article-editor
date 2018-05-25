import React from 'react'
import { Redirect } from 'react-router-dom'
import Spinner from '../icons/spinner'
import { UserProps, withUser } from '../store/UserProvider'

class HomePageContainer extends React.Component<UserProps> {
  public render() {
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (user.data) {
      return <Redirect to={'/projects'} />
    }

    return <Redirect to={'/login'} />
  }
}

export default withUser(HomePageContainer)
