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
import qs from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import config from '../../config'
import client from '../../lib/client'

type Props = RouteComponentProps<{
  sig: string
  sso: string
}>

interface State {
  error?: Error
}

export class CommunityLoginPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    const { sso, sig } = qs.parse(this.props.location.search.substr(1))

    try {
      const resp = await client.get<{ url: string }>('/auth/discourseLogin', {
        params: { sso, sig },
        headers: config.api.headers,
        withCredentials: true,
      })
      window.location.href = resp.data.url
    } catch (error) {
      this.setState({ error })
    }
  }

  public render = () => {
    if (this.state.error) {
      return (
        <React.Fragment>
          <h1>Failed to log in to Manuscripts.io community.</h1>
          <AlertMessage type={AlertMessageType.error}>
            {this.state.error.message}
          </AlertMessage>
        </React.Fragment>
      )
    }

    return (
      <AlertMessage type={AlertMessageType.info}>
        Redirecting to Manuscripts.io community login...
      </AlertMessage>
    )
  }
}

export default CommunityLoginPageContainer
