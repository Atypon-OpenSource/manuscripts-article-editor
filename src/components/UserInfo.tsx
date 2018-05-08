import React from 'react'
import { User } from '../types/user'
import { DropdownLink } from './MenuDropdown'
import {
  ManageAccountMessage,
  PreferencesMessage,
  SignOutMessage,
} from './Messages'

interface UserProps {
  user: User
}

// TODO: remove this once users have names
const emailPrefix = (email: string) => email.replace(/@.+/, '')

export const UserInfo: React.SFC<UserProps> = ({ user }) => (
  <React.Fragment>
    <DropdownLink to={'/account'}>
      {user.givenName || user.name || emailPrefix(user.email)}
    </DropdownLink>
    <DropdownLink to={'/account'}>
      <ManageAccountMessage />
    </DropdownLink>
    <DropdownLink to={'/preferences'}>
      <PreferencesMessage />
    </DropdownLink>
    <DropdownLink to={'/logout'}>
      <SignOutMessage />
    </DropdownLink>
  </React.Fragment>
)
