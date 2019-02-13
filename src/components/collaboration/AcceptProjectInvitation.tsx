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

import React from 'react'
import { acceptProjectInvitation } from '../../lib/api'
import invitationTokenHandler from '../../lib/invitation-token'
import {
  AcceptInvitationError,
  AcceptInvitationSuccess,
} from './AcceptInvitationMessages'

interface State {
  accepted?: boolean
  error?: Error
}

// TODO: require a button press to accept the invitation?
// TODO: allow the invitation to be declined?
// TODO: allow retry if there's an error?

class AcceptProjectInvitation extends React.Component<{}, State> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    const invitationId = invitationTokenHandler.get()

    if (invitationId) {
      invitationTokenHandler.remove()

      try {
        await acceptProjectInvitation(invitationId)

        this.setState({
          accepted: true,
        })
      } catch (error) {
        this.setState({ error })
      }
    }
  }

  public render() {
    const { accepted, error } = this.state

    if (error) {
      return <AcceptInvitationError />
    }

    return accepted ? <AcceptInvitationSuccess /> : null
  }
}

export default AcceptProjectInvitation
