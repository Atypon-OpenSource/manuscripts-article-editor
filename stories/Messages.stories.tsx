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
