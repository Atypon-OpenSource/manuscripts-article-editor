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

import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import BroadcastChannel from 'broadcast-channel'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { TokenActions } from '../../data/TokenData'
import { logout } from '../../lib/account'
import tokenHandler from '../../lib/token'
import userID from '../../lib/user-id'
import { DatabaseProps, withDatabase } from '../DatabaseProvider'
import { Main, Page } from '../Page'

interface Props {
  tokenActions: TokenActions
}

interface State {
  error: Error | null
}

const channel = new BroadcastChannel('logout')

class LogoutPageContainer extends React.Component<
  Props & DatabaseProps & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {
    error: null,
  }

  public async componentDidMount() {
    try {
      await logout()

      tokenHandler.remove()
      userID.remove()

      window.location.assign('/login#action=logout')

      // this isn't really a promise
      /* tslint:disable-next-line:no-floating-promises */
      channel.postMessage('LOGOUT')
    } catch (error) {
      this.setState({ error })
    }
  }

  public render() {
    const { error } = this.state

    return (
      <Page>
        <Main>
          {error && (
            <AlertMessage type={AlertMessageType.error}>
              {error.message}
            </AlertMessage>
          )}
        </Main>
      </Page>
    )
  }
}

channel.onmessage = msg => {
  if (msg === 'LOGOUT') {
    window.location.assign('/login#action=logout')
  }
}

export default withDatabase(LogoutPageContainer)
