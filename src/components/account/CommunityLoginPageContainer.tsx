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
      window.location.assign(resp.data.url)
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
