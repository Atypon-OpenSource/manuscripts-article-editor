import * as React from 'react'
import { SignInMessage } from '../components/Messages'
import { Spinner } from '../components/Spinner'
import { UserInfo, UserLink } from '../components/UserInfo'
import { UserProps, withUser } from '../store/UserProvider'

interface UserContainerState {
  isOpen: boolean
}

class UserContainer extends React.Component<UserProps> {
  public state: UserContainerState = {
    isOpen: false,
  }

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
        <UserLink to={'/login'}>
          <SignInMessage />
        </UserLink>
      )
    }

    return (
      <UserInfo
        user={user.data}
        isOpen={this.state.isOpen}
        toggleOpen={this.toggleOpen}
      />
    )
  }

  private toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
}

export default withUser(UserContainer)
