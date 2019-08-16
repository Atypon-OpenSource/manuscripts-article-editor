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
import config from '../../config'

export const signupVerifyMessage = (
  email: string,
  resendVerificationEmail: (email: string) => void
) => {
  return (
    <AlertMessage
      type={AlertMessageType.success}
      dismissButton={{
        text: 'Click here to re-send.',
        action: () => resendVerificationEmail(email),
      }}
    >
      {`Thanks for signing up! Please click the link sent to ${email} to verify your account.`}
    </AlertMessage>
  )
}

export const signupVerifyConflictMessage = (email: string) => {
  return (
    <AlertMessage
      type={AlertMessageType.warning}
    >{`Account already exists with ${email}. Verification email has been re-sent to your email address.`}</AlertMessage>
  )
}

export const signupVerifyResendSuccessMessage = (email: string) => {
  const supportEmail = config.support.email
  return (
    <AlertMessage type={AlertMessageType.success}>
      {`Verification email re-resent to ${email}. If you have not received it, please wait, check your spam box before getting in touch via ${supportEmail}.`}
      }
    </AlertMessage>
  )
}

export const signupVerifyResendFailureMessage = (
  email: string,
  resendVerificationEmail: (email: string) => void
) => {
  return (
    <AlertMessage
      type={AlertMessageType.error}
      dismissButton={{
        text: 'Click here to retry.',
        action: () => resendVerificationEmail(email),
      }}
    >
      {`Failed to re-send verification email to ${email}.`}
    </AlertMessage>
  )
}
