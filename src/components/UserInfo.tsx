import React from 'react'
import { UserProfile } from '../types/components'
import { DropdownLink } from './Dropdown'
import {
  ManageAccountMessage,
  PreferencesMessage,
  SignOutMessage,
} from './Messages'

interface UserProps {
  user: UserProfile
}

// TODO: remove this once users have names
const emailPrefix = (email: string) => email.replace(/@.+/, '')

const displayName = (user: UserProfile) => {
  if (user.bibliographicName) {
    if (user.bibliographicName.given) {
      return user.bibliographicName.given
    }

    if (user.bibliographicName.literal) {
      return user.bibliographicName.literal
    }
  }

  if (user.email) {
    return emailPrefix(user.email)
  }

  return ''
}

export const UserInfo: React.SFC<UserProps> = ({ user }) => (
  <React.Fragment>
    <DropdownLink to={'/profile'}>{displayName(user)}</DropdownLink>
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
