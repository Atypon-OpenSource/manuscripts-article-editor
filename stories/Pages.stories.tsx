import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import LoginPage from '../src/components/LoginPage'
import ManuscriptsPage from '../src/components/ManuscriptsPage'
import NotFound from '../src/components/NotFound'
import PasswordPage from '../src/components/PasswordPage'
import RecoverPage from '../src/components/RecoverPage'
import SignupPage from '../src/components/SignupPage'
import {
  loginSchema,
  passwordSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'

/* tslint:disable:no-any */

import manuscripts from './data/manuscripts'

storiesOf('Pages', module)
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
  .add('Manuscripts', () => (
    <ManuscriptsPage
      manuscripts={manuscripts}
      addManuscript={action('add manuscript')}
      updateManuscript={() => action('update manuscript')}
      removeManuscript={() => action('remove manuscript')}
    />
  ))
  .add('Manuscripts (empty)', () => (
    <ManuscriptsPage
      manuscripts={[]}
      addManuscript={action('add manuscript')}
      updateManuscript={() => action('update manuscript')}
      removeManuscript={() => action('remove manuscript')}
    />
  ))
  .add('Not found', () => <NotFound />)
