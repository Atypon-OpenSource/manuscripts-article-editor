import React from 'react'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import {
  AcceptedInvitationFailureMessage,
  AcceptedInvitationSuccessMessage,
} from '../Messages'

interface Props {
  invitationAccepted: boolean | null
}

const AcceptInvitationMessages: React.SFC<Props> = ({ invitationAccepted }) => {
  if (invitationAccepted) {
    return (
      <AlertMessage
        type={AlertMessageType.success}
        dismissButton={{ text: 'OK' }}
      >
        <AcceptedInvitationSuccessMessage />
      </AlertMessage>
    )
  }

  if (invitationAccepted === false) {
    return (
      <AlertMessage
        type={AlertMessageType.error}
        dismissButton={{ text: 'OK' }}
      >
        <AcceptedInvitationFailureMessage />
      </AlertMessage>
    )
  }

  return null
}

export default AcceptInvitationMessages
