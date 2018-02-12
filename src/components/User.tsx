import * as React from 'react'
import { UserInterface } from '../store/authentication/types'
import { LinkButton } from './Button'

interface UserProps {
  user?: UserInterface
}

export const User: React.SFC<UserProps> = ({ user }) => {
  if (!user) {
    return <LinkButton to={'/login'}>Sign in</LinkButton>
  }

  return (
    <React.Fragment>
      <div>{user.name}</div>
      <LinkButton to={'/logout'}>Sign out</LinkButton>
    </React.Fragment>
  )
}
