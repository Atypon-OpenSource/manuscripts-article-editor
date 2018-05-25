import React from 'react'
import { MenuLink } from '../components/Menu'
import { SignInMessage } from '../components/Messages'
import { Spinner } from '../components/Spinner'
import { UserMenu } from '../components/UserMenu'
import { UserProps, withUser } from '../store/UserProvider'

class UserContainer extends React.Component<UserProps> {
  public render() {
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (!user.data) {
      if (user.error) {
        return <Spinner color={'red'} />
      }

      return (
        <MenuLink to={'/login'}>
          <SignInMessage />
        </MenuLink>
      )
    }

    return <UserMenu user={user.data} />
  }
}

export default withUser(UserContainer)
