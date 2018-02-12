import { Formik } from 'formik'
import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { LoginForm } from '../src/components/LoginForm'
import { PasswordForm } from '../src/components/PasswordForm'
import { SendPasswordResetForm } from '../src/components/SendPasswordResetForm'
import { SignupForm } from '../src/components/SignupForm'
import {
  loginSchema,
  passwordSchema,
  sendPasswordResetSchema,
  signupSchema,
} from '../src/validation'

storiesOf('Forms', module)
  .add('Sign up', () => (
    <Formik
      initialValues={{ name: '', surname: '', email: '', password: '' }}
      validationSchema={signupSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={SignupForm}
    />
  ))
  .add('Login', () => (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={LoginForm}
    />
  ))
  .add('Send Password Reset', () => (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={sendPasswordResetSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={SendPasswordResetForm}
    />
  ))
  .add('Password', () => (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={passwordSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={PasswordForm}
    />
  ))
