import React from 'react'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import {
  AcceptedInvitationFailureMessage,
  AcceptedInvitationSuccessMessage,
} from '../Messages'

export const AcceptInvitationSuccess = () => (
  <AlertMessage type={AlertMessageType.success} dismissButton={{ text: 'OK' }}>
    <AcceptedInvitationSuccessMessage />
  </AlertMessage>
)

export const AcceptInvitationError = () => (
  <AlertMessage type={AlertMessageType.error} dismissButton={{ text: 'OK' }}>
    <AcceptedInvitationFailureMessage />
  </AlertMessage>
)
