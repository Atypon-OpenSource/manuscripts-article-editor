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

import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { TokenActions } from '../../data/TokenData'
import { logout } from '../../lib/account'
import userID from '../../lib/user-id'
import { DatabaseProps, withDatabase } from '../DatabaseProvider'
import { Main, Page } from '../Page'

interface Props {
  tokenActions: TokenActions
}

interface State {
  error: Error | null
}

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

      this.props.tokenActions.delete()
      userID.remove()

      this.props.history.push({
        pathname: '/login',
        state: {
          infoLoginMessage: 'You have been logged out.',
        },
      })
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

export default withDatabase(LogoutPageContainer)
