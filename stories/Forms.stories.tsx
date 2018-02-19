import { Formik } from 'formik'
import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { AccountForm } from '../src/components/AccountForm'
import { LoginForm } from '../src/components/LoginForm'
import { PasswordForm } from '../src/components/PasswordForm'
import { RecoverForm } from '../src/components/RecoverForm'
import { SignupForm } from '../src/components/SignupForm'
import {
  accountSchema,
  loginSchema,
  passwordSchema,
  recoverSchema,
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
  .add('Recover', () => (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={recoverSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={RecoverForm}
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
  .add('Account', () => (
    <Formik
      initialValues={{ name: '', surname: '', phone: '' }}
      validationSchema={accountSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={AccountForm}
    />
  ))
