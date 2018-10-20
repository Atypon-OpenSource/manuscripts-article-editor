import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import LoginPage from '../src/components/account/LoginPage'
import PasswordPage from '../src/components/account/PasswordPage'
import RecoverPage from '../src/components/account/RecoverPage'
import SignupPage from '../src/components/account/SignupPage'
import {
  loginSchema,
  passwordSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'

storiesOf('Account/Pages', module)
  .add('Sign up', () => (
    <SignupPage
      initialValues={{
        name: '',
        email: '',
        password: '',
        allowsTracking: false,
      }}
      validationSchema={signupSchema}
      onSubmit={action('sign up')}
    />
  ))
  .add('Login', () => (
    <LoginPage
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={action('login')}
      verificationMessage={''}
      loginMessage={''}
      resendVerificationEmail={action('resend verification email')}
    />
  ))
  .add('Recover', () => (
    <RecoverPage
      initialValues={{ email: '' }}
      validationSchema={recoverSchema}
      onSubmit={action('recover')}
    />
  ))
  .add('Set password', () => (
    <PasswordPage
      initialValues={{ password: '' }}
      validationSchema={passwordSchema}
      onSubmit={action('save password')}
    />
  ))
