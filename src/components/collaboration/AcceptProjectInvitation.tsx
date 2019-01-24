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
