import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import LoginMessages from '../src/components/account/LoginMessages'

storiesOf('LoginMessages', module)
  .add('verification failed', () => (
    <LoginMessages
      verificationMessage={
        'Account verification failed. Is the account already verified?'
      }
      loginMessage={null}
      resendVerificationData={null}
      identityProviderError={null}
      resendVerificationEmail={() => action('resend')}
      infoLoginMessage={null}
      networkError={null}
      gatewayInaccessible={null}
    />
  ))
  .add('user logged out successfully', () => (
    <LoginMessages
      verificationMessage={null}
      loginMessage={null}
      resendVerificationData={null}
      identityProviderError={null}
      resendVerificationEmail={() => action('resend')}
      infoLoginMessage={'You have been logged out.'}
      networkError={null}
      gatewayInaccessible={null}
    />
  ))
  .add('cannot connect to the api', () => (
    <LoginMessages
      verificationMessage={null}
      loginMessage={null}
      resendVerificationData={null}
      identityProviderError={null}
      resendVerificationEmail={() => action('resend')}
      infoLoginMessage={null}
      networkError={true}
      gatewayInaccessible={null}
    />
  ))
  .add('cannot connect to gateway', () => (
    <LoginMessages
      verificationMessage={null}
      loginMessage={null}
      resendVerificationData={null}
      identityProviderError={null}
      resendVerificationEmail={() => action('resend')}
      infoLoginMessage={null}
      networkError={false}
      gatewayInaccessible={true}
    />
  ))
