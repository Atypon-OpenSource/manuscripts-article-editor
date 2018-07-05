import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'
import { ChangePasswordForm } from '../src/components/ChangePasswordForm'
import { DeleteAccountForm } from '../src/components/DeleteAccountForm'
import { LoginForm } from '../src/components/LoginForm'
import { PasswordForm } from '../src/components/PasswordForm'
import { ProfileForm } from '../src/components/ProfileForm'
import { RecoverForm } from '../src/components/RecoverForm'
import { SignupForm } from '../src/components/SignupForm'
import { BIBLIOGRAPHIC_NAME } from '../src/transformer/object-types'
import {
  changePasswordSchema,
  deleteAccountSchema,
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
  .add('Choose password', () => (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={passwordSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={PasswordForm}
    />
  ))
  .add('Profile', () => (
    <Formik
      initialValues={{
        bibliographicName: {
          _id: '',
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
  .add('Change password', () => (
    <Formik
      initialValues={{ currentPassword: '', newPassword: '' }}
      validationSchema={changePasswordSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={ChangePasswordForm}
    />
  ))
  .add('Delete account', () => (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={deleteAccountSchema}
      isInitialValid={false}
      onSubmit={action('submit')}
      component={DeleteAccountForm}
    />
  ))
