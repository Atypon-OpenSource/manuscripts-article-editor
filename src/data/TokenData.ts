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
