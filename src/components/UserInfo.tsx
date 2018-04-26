import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../theme'
import { User } from '../types/user'
import { Avatar } from './Avatar'

export const UserLink = styled(NavLink)`
  display: block;
  color: #788faa;
  padding: 6px 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  border-radius: 6px;
  margin: 6px 0;

  &:hover {
    color: white;
    background-color: #91c4ff;
  }
`

const UserContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: #788faa;
  padding: 6px 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  border-radius: 6px;
  margin: 6px 0;
  cursor: pointer;
`

const UserName = styled.div`
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DropdownContent = styled.div`
  position: absolute;
  top: 50px;
  left: 40px;
  background: #fff;
  padding: 10px;
  box-shadow: 0 1px 5px #ccc;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 2;
`

interface UserProps {
  user: User
  isOpen: boolean
  toggleOpen: () => void
}

// TODO: remove this once users have names
const emailPrefix = (email: string) => email.replace(/@.+/, '')

export const UserInfo: React.SFC<UserProps> = ({
  user,
  isOpen,
  toggleOpen,
}) => (
  <UserContainer onClick={toggleOpen}>
    <Avatar src={user.avatar} size={32} color={'#788faa'} />
    <UserName>
      {user.givenName || user.name || emailPrefix(user.email)}
    </UserName>
    <div>▼</div>

    {isOpen && (
      <DropdownContent>
        <UserLink to={'/account'}>Manage Account</UserLink>
        <UserLink to={'/logout'}>Sign out</UserLink>
      </DropdownContent>
    )}
  </UserContainer>
)
