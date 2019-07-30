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

import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { acceptProjectInvitationToken } from '../../lib/api'
import { Loading } from '../Loading'

interface State {
  data?: {
    message: string
    containerID: string
  }
}

interface RouteParams {
  invitationToken: string
}

class AcceptInvitationURIContainer extends React.Component<
  RouteComponentProps<RouteParams>
> {
  public state: Readonly<State> = {}

  public componentDidMount() {
    const { invitationToken } = this.props.match.params

    acceptProjectInvitationToken(invitationToken).then(
      ({ data }) => {
        this.setState({ data })
      },
      error => {
        let errorMessage
        if (error.response) {
          if (error.response.status === HttpStatusCodes.GONE) {
            errorMessage = 'Invitation is no longer valid.'
          } else if (error.response.status === HttpStatusCodes.NOT_FOUND) {
            errorMessage = 'Project no longer exists.'
          } else {
            errorMessage = 'There was an error accepting the invitation'
          }
        }

        this.props.history.push({
          pathname: '/projects',
          state: {
            errorMessage,
          },
        })
      }
    )
  }

  public render() {
    const { data } = this.state

    if (!data) return <Loading />

    return (
      <Redirect
        to={{
          pathname: `/projects/${data.containerID}`,
          state: {
            infoMessage: data.message,
          },
        }}
      />
    )
  }
}

export default AcceptInvitationURIContainer
