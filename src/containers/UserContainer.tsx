import React from 'react'
import { SignInMessage } from '../components/Messages'
import { Spinner } from '../components/Spinner'
import { UserInfo, UserLink } from '../components/UserInfo'
import { UserProps, withUser } from '../store/UserProvider'

interface State {
  isOpen: boolean
}

type Props = UserProps

class UserContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
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
