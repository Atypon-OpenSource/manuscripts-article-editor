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
import { AlertMessageType } from '../src/components/AlertMessage'
import {
  AcceptInvitationError,
  AcceptInvitationSuccess,
} from '../src/components/collaboration/AcceptInvitationMessages'
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
