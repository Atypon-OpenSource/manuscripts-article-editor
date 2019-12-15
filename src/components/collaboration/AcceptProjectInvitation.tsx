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

import { History } from 'history'
import React from 'react'
import { Redirect } from 'react-router'
import {
  acceptProjectInvitation,
  acceptProjectInvitationToken,
} from '../../lib/api'
import invitationTokenHandler from '../../lib/invitation-token'
import {
  acceptInvitationErrorMessage,
  acceptInvitationTokenErrorMessage,
} from '../Messages'

interface State {
  data?: {
    message: string
    containerID: string
  }
  errorMessage?: string
}

interface Props {
  history: History
}

// TODO: require a button press to accept the invitation?
// TODO: allow the invitation to be declined?
// TODO: allow retry if there's an error?

class AcceptProjectInvitation extends React.Component<Props, State> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    const invitationToken = invitationTokenHandler.get()

    if (
      invitationToken &&
      invitationToken.startsWith('MPContainerInvitation')
    ) {
      invitationTokenHandler.remove()

      await acceptProjectInvitation(invitationToken).then(
        ({ data }) => {
          this.setState({ data })
        },
        error => {
          const errorMessage = error.response
            ? acceptInvitationErrorMessage(error.response.status)
            : undefined

          this.setState({ errorMessage })
        }
      )
    } else if (invitationToken) {
      invitationTokenHandler.remove()

      await acceptProjectInvitationToken(invitationToken).then(
        ({ data }) => {
          this.setState({ data })
        },
        error => {
          const errorMessage = error.response
            ? acceptInvitationTokenErrorMessage(error.response.status)
            : undefined

          this.setState({ errorMessage })
        }
      )
    }
  }

  public render() {
    const { data, errorMessage } = this.state

    if (!data && !errorMessage) return null

    if (data) {
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

    if (errorMessage) {
      return (
        <Redirect
          to={{
            pathname: '/projects',
            state: {
              errorMessage,
            },
          }}
        />
      )
    }
  }
}

export default AcceptProjectInvitation
