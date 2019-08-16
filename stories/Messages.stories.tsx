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

import { AlertMessageType } from '@manuscripts/style-guide'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  gatewayInaccessibleErrorMessage,
  identityProviderErrorMessage,
  infoLoginMessage,
  networkErrorMessage,
  resendVerificationDataMessage,
  verificationMessage,
  warningLoginMessage,
} from '../src/components/account/LoginMessages'
import {
  signupVerifyConflictMessage,
  signupVerifyMessage,
  signupVerifyResendFailureMessage,
  signupVerifyResendSuccessMessage,
} from '../src/components/account/SignupMessages'
import {
  AcceptInvitationError,
  AcceptInvitationSuccess,
} from '../src/components/collaboration/AcceptInvitationMessages'
import MessageBanner from '../src/components/MessageBanner'
import {
  AcceptedInvitationFailureMessage,
  AcceptedInvitationSuccessMessage,
  AddAuthorsMessage,
  EmptyManuscriptsMessage,
  FeedbackMessage,
  ImportManuscriptMessage,
  ManageProfileMessage,
  ManuscriptsTitleMessage,
  PreferencesMessage,
  SignInMessage,
} from '../src/components/Messages'

storiesOf('Account/Messages/Login', module)
  .add('warningLoginMessage', () =>
    warningLoginMessage('This is a warning message')
  )
  .add('verificationMessage', () =>
    verificationMessage('account-verification-failed')
  )
  .add('verificationMessage default', () =>
    verificationMessage('Verification failed')
  )
  .add('infoLoginMessage', () => infoLoginMessage('Logged in successfully'))
  .add('identityProviderErrorMessage - user not found', () =>
    identityProviderErrorMessage('user-not-found')
  )
  .add('identityProviderErrorMessage - validation-error', () =>
    identityProviderErrorMessage('validation-error')
  )
  .add('identityProviderErrorMessage - default', () =>
    identityProviderErrorMessage('')
  )
  .add('gatewayInaccessibleErrorMessage', () =>
    gatewayInaccessibleErrorMessage()
  )
  .add('networkErrorMessage', () => networkErrorMessage())
  .add('resendVerificationDataMessage', () =>
    resendVerificationDataMessage(
      {
        email: 'foobar@manuscripts.com',
        type: AlertMessageType.success,
        message:
          'Verification message send successfully to foobar@manuscripts.com',
      },
      action('Resend verification email')
    )
  )

storiesOf('Account/Messages/Signup', module)
  .add('signupVerifyMessage', () =>
    signupVerifyMessage(
      'foobar@manuscripts.com',
      action('Resend verification email')
    )
  )
  .add('signupVerifyConflictMessage', () =>
    signupVerifyConflictMessage('foobar@manuscripts.com')
  )
  .add('signupVerifyResendSuccessMessage', () =>
    signupVerifyResendSuccessMessage('foobar@manuscripts.com')
  )
  .add('signupVerifyResendFailureMessage', () =>
    signupVerifyResendFailureMessage(
      'foobar@manuscripts.com',
      action('Resend verification email')
    )
  )

storiesOf('Collaboration/Messages/AcceptInvitation', module)
  .add('success', () => <AcceptInvitationSuccess />)
  .add('error', () => <AcceptInvitationError />)

storiesOf('Messages', module)
  .add('SignInMessage', () => <SignInMessage />)
  .add('ManageProfileMessage', () => <ManageProfileMessage />)
  .add('PreferencesMessage', () => <PreferencesMessage />)
  .add('ManuscriptsTitleMessage', () => <ManuscriptsTitleMessage />)
  .add('EmptyManuscriptsMessage', () => <EmptyManuscriptsMessage />)
  .add('ImportManuscriptMessage', () => <ImportManuscriptMessage />)
  .add('AddAuthorsMessage', () => <AddAuthorsMessage />)
  .add('FeedbackMessage', () => <FeedbackMessage />)
  .add('AcceptedInvitationSuccessMessage', () => (
    <AcceptedInvitationSuccessMessage />
  ))
  .add('AcceptedInvitationFailureMessage', () => (
    <AcceptedInvitationFailureMessage />
  ))
  .add('MessageBanner', () => {
    window.location.hash = '#action=reset-password'
    return <MessageBanner />
  })
