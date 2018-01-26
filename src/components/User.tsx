import * as React from 'react'
import { User as UserType } from '../types'
import { LinkButton } from './Button'

interface UserProps {
  user: UserType
}

export const User = ({ user }: UserProps) => (
  <React.Fragment>
    <div>{user.name}</div>
    <LinkButton to={'/logout'}>Sign out</LinkButton>
  </React.Fragment>
)
