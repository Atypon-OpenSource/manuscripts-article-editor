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

import { stringify } from 'qs'
import React from 'react'
import config from '../../config'
import deviceId from '../../lib/device-id'
import { AuthenticationButtonProps } from './Authentication'

export type AuthProvider = 'google' | 'orcid' | 'iam'

interface Props {
  component: React.FunctionComponent<AuthenticationButtonProps>
}

class AuthButtonContainer extends React.Component<Props> {
  public render() {
    const { component: Component } = this.props

    return <Component redirect={this.redirect} />
  }

  private redirect = (provider: AuthProvider) => () => {
    const params = {
      deviceId,
      ...config.api.headers,
    }

    window.location.href =
      config.api.url + '/auth/' + provider + '?' + stringify(params)
  }
}

export default AuthButtonContainer
