/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import {
  ChangePasswordMessage,
  DeleteAccountMessage,
  FeedbackMessage,
  SignOutMessage,
} from '../Messages'
import { DropdownLink, DropdownSeparator } from './Dropdown'

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
    <DropdownSeparator />
    <DropdownLink to={'/feedback'}>
      <FeedbackMessage />
    </DropdownLink>
    <DropdownSeparator />
    {/*<DropdownLink to={'/preferences'}>
      <PreferencesMessage />
    </DropdownLink>*/}
    <DropdownLink to={'/logout'}>
      <SignOutMessage />
    </DropdownLink>
  </React.Fragment>
)
