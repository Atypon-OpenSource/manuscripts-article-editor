import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'
import { AccountForm } from '../src/components/AccountForm'
import { LoginForm } from '../src/components/LoginForm'
import { PasswordForm } from '../src/components/PasswordForm'
import { ProfileForm } from '../src/components/ProfileForm'
import { RecoverForm } from '../src/components/RecoverForm'
import { SignupForm } from '../src/components/SignupForm'
import { BIBLIOGRAPHIC_NAME } from '../src/transformer/object-types'
import {
  accountSchema,
  loginSchema,
  passwordSchema,
  profileSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'

storiesOf('Forms', module)
  .add('Sign up', () => (
    <React.Fragment>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={signupSchema}
        isInitialValid={false}
        onSubmit={action('submit')}
        component={SignupForm}
      />
    </React.Fragment>
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
      initialValues={{ password: '' }}
      validationSchema={accountSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={AccountForm}
    />
  ))
  .add('Profile', () => (
    <Formik
      initialValues={{
        bibliographicName: {
          id: '',
          objectType: BIBLIOGRAPHIC_NAME,
          given: '',
          family: '',
        },
      }}
      validationSchema={profileSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={ProfileForm}
    />
  ))
