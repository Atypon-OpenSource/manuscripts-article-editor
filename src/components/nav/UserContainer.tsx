import React from 'react'
import { UserProps, withUser } from '../../store/UserProvider'
import { SignInMessage } from '../Messages'
import { Spinner } from '../Spinner'
import { MenuLink } from './Menu'
import { UserMenu } from './UserMenu'

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
