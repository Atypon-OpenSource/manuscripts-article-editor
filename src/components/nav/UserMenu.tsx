import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
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
