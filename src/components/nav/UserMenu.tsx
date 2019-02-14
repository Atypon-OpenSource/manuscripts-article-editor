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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import React from 'react'
import { Avatar } from '../Avatar'
import MenuDropdown from './MenuDropdown'
import { UserInfo } from './UserInfo'

interface Props {
  user: UserProfileWithAvatar
}

export const UserMenu: React.FunctionComponent<Props> = ({ user }) => (
  <MenuDropdown
    id={'user-dropdown'}
    buttonContents={<Avatar src={user.avatar} size={32} />}
    dropdownStyle={{ right: 0, left: 'auto' }}
  >
    <UserInfo user={user} />
  </MenuDropdown>
)
