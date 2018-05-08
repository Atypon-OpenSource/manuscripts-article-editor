import React from 'react'
import { Avatar } from '../components/Avatar'
import { MenuLink } from '../components/Menu'
import MenuDropdown from '../components/MenuDropdown'
import { SignInMessage } from '../components/Messages'
import { Spinner } from '../components/Spinner'
import { UserInfo } from '../components/UserInfo'
import { UserProps, withUser } from '../store/UserProvider'

type Props = UserProps

class UserContainer extends React.Component<Props> {
  public render() {
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (!user.data) {
      if (user.error) {
        return <Spinner color={'red'} />
      }

      return (
        <MenuLink to={'/login'}>
          <SignInMessage />
        </MenuLink>
      )
    }

    return (
      <MenuDropdown
        buttonContents={
          <MenuLink to={'/account'}>
            <Avatar src={user.data.avatar} size={16} color={'#788faa'} />
          </MenuLink>
        }
        dropdownStyle={{
          right: 5,
          left: 'auto',
        }}
      >
        <UserInfo user={user.data} />
      </MenuDropdown>
    )
  }
}

export default withUser(UserContainer)
