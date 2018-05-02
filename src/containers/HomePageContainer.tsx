import React from 'react'
import { Redirect } from 'react-router-dom'
// import HomePage from '../components/HomePage'
import { Spinner } from '../components/Spinner'
import { UserProps, withUser } from '../store/UserProvider'

class HomePageContainer extends React.Component<UserProps> {
  public render() {
    const { user } = this.props

    if (user.error) {
      return <Spinner color={'red'} />
    }

    if (!user.loaded) {
      return <Spinner color={'black'} />
    }

    if (user.data) {
      return <Redirect to={'/manuscripts'} />
    }

    return <Redirect to={'/login'} />
  }
}

export default withUser(HomePageContainer)
