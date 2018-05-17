import React from 'react'
import { Redirect } from 'react-router-dom'
// import HomePage from '../components/HomePage'
import { Spinner } from '../components/Spinner'
import { UserProps, withUser } from '../store/UserProvider'

type Props = UserProps

class HomePageContainer extends React.Component<Props> {
  public render() {
    const { user } = this.props

    if (!user.loaded) {
      if (user.error) {
        return <Spinner color={'red'} />
      }

      return <Spinner color={'black'} />
    }

    if (user.data) {
      return <Redirect to={'/projects'} />
    }

    return <Redirect to={'/login'} />
  }
}

export default withUser(HomePageContainer)
