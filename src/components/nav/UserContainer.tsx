import React from 'react'
import UserData from '../../data/UserData'
import { getCurrentUserId } from '../../lib/user'
import { SignInMessage } from '../Messages'
import { MenuLink } from './Menu'
import { UserMenu } from './UserMenu'

const UserContainer = () => (
  <UserData userID={getCurrentUserId()!}>
    {user =>
      user ? (
        <UserMenu user={user} />
      ) : (
        <MenuLink to={'/login'}>
          <SignInMessage />
        </MenuLink>
      )
    }
  </UserData>
)

export default UserContainer
