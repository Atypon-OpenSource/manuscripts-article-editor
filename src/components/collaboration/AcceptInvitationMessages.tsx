import React from 'react'
import AlertMessage from '../AlertMessage'
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
      <AlertMessage type={'success'} dismissButtonText={'OK.'}>
        <AcceptedInvitationSuccessMessage />
      </AlertMessage>
    )
  }

  if (invitationAccepted === false) {
    return (
      <AlertMessage type={'error'} dismissButtonText={'OK.'}>
        <AcceptedInvitationFailureMessage />
      </AlertMessage>
    )
  }

  return null
}

export default AcceptInvitationMessages
