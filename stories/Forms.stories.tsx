import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'
import { AccountForm } from '../src/components/AccountForm'
import { CollaboratorForm } from '../src/components/CollaboratorForm'
import { GroupForm } from '../src/components/GroupForm'
import { LoginForm } from '../src/components/LoginForm'
import { PasswordForm } from '../src/components/PasswordForm'
import { RecoverForm } from '../src/components/RecoverForm'
import { SignupForm } from '../src/components/SignupForm'
import {
  accountSchema,
  collaboratorSchema,
  groupSchema,
  loginSchema,
  passwordSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'

storiesOf('Forms', module)
  .add('Sign up', () => (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
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
      initialValues={{ givenName: '', familyName: '', phone: '' }}
      validationSchema={accountSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={AccountForm}
    />
  ))
  .add('Group', () => (
    <Formik
      initialValues={{ name: '', description: '' }}
      validationSchema={groupSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={GroupForm}
    />
  ))
  .add('Collaborator', () => (
    <Formik
      initialValues={{ givenName: '', familyName: '' }}
      validationSchema={collaboratorSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={CollaboratorForm}
    />
  ))
