import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { UserInterface } from '../store/authentication/types'
import { styled } from '../theme'

interface UserProps {
  user?: UserInterface
}

const UserLink = styled(NavLink)`
  display: block;
  color: #788faa;
  padding: 6px 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  border-radius: 6px;
  margin: 6px 0;

  &:hover {
    color: white;
    background-color: #91c4ff;
  }
`

export const User: React.SFC<UserProps> = ({ user }) => {
  if (!user) {
    return <UserLink to={'/login'}>Sign in</UserLink>
  }

  return (
    <React.Fragment>
      <UserLink to={'/account'}>{user.name || 'Account'}</UserLink>
      <UserLink to={'/logout'}>Sign out</UserLink>
    </React.Fragment>
  )
}
