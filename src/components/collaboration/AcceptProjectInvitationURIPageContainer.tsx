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

import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { acceptProjectInvitationToken } from '../../lib/api'
import { LoadingPage } from '../Loading'

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

    if (!data) return <LoadingPage>Accepting invitation…</LoadingPage>

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
