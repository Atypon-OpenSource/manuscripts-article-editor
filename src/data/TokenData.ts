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
