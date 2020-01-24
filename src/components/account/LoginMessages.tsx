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
import React from 'react'
import { ContactSupportButton } from '../ContactSupportButton'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

export const warningLoginMessage = (message: string) => {
  return <AlertMessage type={AlertMessageType.warning}>{message}</AlertMessage>
}

export const verificationMessage = (message: string) => {
  switch (message) {
    case 'account-verification-failed':
      return (
        <AlertMessage type={AlertMessageType.error}>
          {'Account verification failed. Is the account already verified?'}
        </AlertMessage>
      )
    default:
      return <AlertMessage type={AlertMessageType.info}>{message}</AlertMessage>
  }
}

export const infoLoginMessage = (message: string) => {
  return <AlertMessage type={AlertMessageType.info}>{message}</AlertMessage>
}

export const identityProviderErrorMessage = (message: string) => {
  let alertMessage: JSX.Element
  switch (message) {
    case 'user-not-found':
      alertMessage = (
        <span>
          A user record matching your identity was unexpectedly not found.
          Please <ContactSupportButton>contact support</ContactSupportButton> if
          this persists.
        </span>
      )
      break

    case 'validation-error':
      alertMessage = (
        <span>
          An invalid request was made when attempting to log in. Please{' '}
          <ContactSupportButton>contact support</ContactSupportButton> if this
          persists.
        </span>
      )
      break

    default:
      alertMessage = (
        <span>
          An error occurred while logging in, please{' '}
          <ContactSupportButton>contact support.</ContactSupportButton>
        </span>
      )
  }

  return (
    <AlertMessage type={AlertMessageType.error}>{alertMessage}</AlertMessage>
  )
}

export const gatewayInaccessibleErrorMessage = () => {
  return (
    <AlertMessage type={AlertMessageType.error}>
      {'Trouble reaching manuscripts.io servers. Please try again later.'}
    </AlertMessage>
  )
}

export const networkErrorMessage = () => {
  return (
    <AlertMessage type={AlertMessageType.error}>
      <span>
        Failed to connect to service. Please check your network connection
        before trying again, and if the problem persists{' '}
        <ContactSupportButton>contact support.</ContactSupportButton>
      </span>
    </AlertMessage>
  )
}

export const resendVerificationDataMessage = (
  resendVerificationData: ResendVerificationData,
  resendVerificationEmail: (email: string) => void
) => {
  return (
    <AlertMessage
      type={resendVerificationData.type}
      dismissButton={{
        text: 'Re-send verification email.',
        action: () => resendVerificationEmail(resendVerificationData.email),
      }}
    >
      {resendVerificationData.message}
    </AlertMessage>
  )
}

export const userAccountErrorMessage = () => {
  return (
    <AlertMessage type={AlertMessageType.error}>
      <span>
        Your user account record is missing required information. This is most
        likely because of having logged in with an earlier version of the app.
        Please <ContactSupportButton>contact support</ContactSupportButton> for
        assistance.
      </span>
    </AlertMessage>
  )
}
