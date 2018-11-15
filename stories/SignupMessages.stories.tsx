import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import SignupMessages from '../src/components/account/SignupMessages'

storiesOf('SignupMessages', module)
  .add('verification email sent', () => (
    <SignupMessages
      resendSucceed={null}
      confirming={{ email: 'foo@bar.com' }}
      existButNotVerified={null}
      resendVerificationEmail={() => action('resend')}
      networkError={null}
      gatewayInaccessible={null}
    />
  ))
  .add('verification email resent successfully', () => (
    <SignupMessages
      resendSucceed={true}
      confirming={{ email: 'foo@bar.com' }}
      existButNotVerified={null}
      resendVerificationEmail={() => action('resend')}
      networkError={null}
      gatewayInaccessible={null}
    />
  ))
  .add('verification email failed to resend', () => (
    <SignupMessages
      resendSucceed={false}
      confirming={{ email: 'foo@bar.com' }}
      existButNotVerified={null}
      resendVerificationEmail={() => action('resend')}
      networkError={null}
      gatewayInaccessible={null}
    />
  ))
  .add('the user exist but not verified', () => (
    <SignupMessages
      resendSucceed={true}
      confirming={null}
      existButNotVerified={{ email: 'bar@baz.com' }}
      resendVerificationEmail={() => action('resend')}
      networkError={null}
      gatewayInaccessible={null}
    />
  ))
  .add('cannot connect to the api', () => (
    <SignupMessages
      resendSucceed={null}
      confirming={null}
      existButNotVerified={null}
      resendVerificationEmail={() => action('resend')}
      networkError={true}
      gatewayInaccessible={null}
    />
  ))
