import React from 'react'
import { UserProfile } from '../types/components'
import { Avatar } from './Avatar'
import { MenuLink } from './Menu'
import MenuDropdown from './MenuDropdown'
import { UserInfo } from './UserInfo'

interface Props {
  user: UserProfile
}

// TODO: avatar from attachment

export const UserMenu: React.SFC<Props> = ({ user }) => (
  <MenuDropdown
    buttonContents={
      <MenuLink to={'/profile'}>
        <Avatar src={user.avatar} size={32} color={'#788faa'} />
      </MenuLink>
    }
    dropdownStyle={{
      right: 5,
      left: 'auto',
    }}
  >
    <UserInfo user={user} />
  </MenuDropdown>
)
