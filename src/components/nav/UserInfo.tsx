/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
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
