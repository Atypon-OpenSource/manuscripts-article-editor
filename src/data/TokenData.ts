import decode from 'jwt-decode'
import React from 'react'

const storage = window.localStorage

export interface TokenActions {
  delete: () => void
  update: (token: string) => void
}

interface Payload {
  expiry: number
  userId: string
  userProfileId: string
  wayfLocal?: string
}

interface Props {
  children: (
    data: {
      userID?: string
      userProfileID?: string
    },
    actions: TokenActions
  ) => React.ReactNode
}

interface State {
  loaded: boolean
  userID?: string
  userProfileID?: string
}

// TODO: handle token expiry
// TODO: provide profile id using context?

export class TokenData extends React.PureComponent<Props, State> {
  public state: Readonly<State> = {
    loaded: false,
  }

  private token: string | null

  public componentDidMount() {
    this.token = storage.getItem('token')

    if (this.token) {
      this.parseToken(this.token)
    } else {
      this.setState({
        loaded: true,
      })
    }
  }

  public render() {
    const { children } = this.props

    if (!this.state.loaded) return null

    return children(this.state, {
      delete: this.deleteToken,
      update: this.updateToken,
    })
  }

  private parseToken = (token: string) => {
    const { userId, userProfileId } = decode<Payload>(token)

    if (userId && userProfileId) {
      this.setState({
        userID: userId.replace('|', '_'),
        userProfileID: userProfileId,
      })
    } else {
      this.deleteToken()
    }

    this.setState({
      loaded: true,
    })
  }

  private deleteToken = () => {
    storage.removeItem('token')
    this.token = null
    this.setState({
      userID: undefined,
      userProfileID: undefined,
    })
  }

  private updateToken = (token: string) => {
    storage.setItem('token', token)
    this.token = token
    this.parseToken(token)
  }
}
