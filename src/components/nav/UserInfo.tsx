import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import {
  ChangePasswordMessage,
  DeleteAccountMessage,
  SignOutMessage,
} from '../Messages'
import { DropdownLink } from './Dropdown'

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

export const UserInfo: React.FunctionComponent<UserProps> = ({ user }) => (
  <React.Fragment>
    <DropdownLink to={'/profile'}>{displayName(user)}</DropdownLink>
    <DropdownLink to={'/change-password'}>
      <ChangePasswordMessage />
    </DropdownLink>
    <DropdownLink to={'/delete-account'}>
      <DeleteAccountMessage />
    </DropdownLink>
    {/*<DropdownLink to={'/preferences'}>
      <PreferencesMessage />
    </DropdownLink>*/}
    <DropdownLink to={'/logout'}>
      <SignOutMessage />
    </DropdownLink>
  </React.Fragment>
)
