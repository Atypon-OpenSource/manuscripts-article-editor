import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import SignupMessages from '../src/components/SignupMessages'

storiesOf('SignupMessages', module)
  .add('verification email sent', () => (
    <SignupMessages
      resendSucceed={null}
      confirming={{ email: 'foo@bar.com' }}
      existButNotVerified={null}
      resendVerificationEmail={() => action('resend')}
    />
  ))
  .add('verification email resent successfully', () => (
    <SignupMessages
      resendSucceed={true}
      confirming={{ email: 'foo@bar.com' }}
      existButNotVerified={null}
      resendVerificationEmail={() => action('resend')}
    />
  ))
  .add('verification email failed to resend', () => (
    <SignupMessages
      resendSucceed={false}
      confirming={{ email: 'foo@bar.com' }}
      existButNotVerified={null}
      resendVerificationEmail={() => action('resend')}
    />
  ))
  .add('the user exist but not verified', () => (
    <SignupMessages
      resendSucceed={true}
      confirming={null}
      existButNotVerified={{ email: 'bar@baz.com' }}
      resendVerificationEmail={() => action('resend')}
    />
  ))
