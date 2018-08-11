import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'
import { ChangePasswordForm } from '../src/components/ChangePasswordForm'
import { DeleteAccountForm } from '../src/components/DeleteAccountForm'
import { LoginForm } from '../src/components/LoginForm'
import ModalForm from '../src/components/ModalForm'
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
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={action('submit')}
        component={SignupForm}
      />
    </React.Fragment>
  ))
  .add('Login', () => (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={action('submit')}
      component={LoginForm}
    />
  ))
  .add('Recover', () => (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={recoverSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={action('submit')}
      component={RecoverForm}
    />
  ))
  .add('Choose password', () => (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={passwordSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={action('submit')}
      component={PasswordForm}
    />
  ))

storiesOf('Forms/Modal', module)
  .add('Profile', () => (
    <ModalForm title={'Manage profile'}>
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
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={action('submit')}
        component={ProfileForm}
      />
    </ModalForm>
  ))
  .add('Change password', () => (
    <ModalForm title={'Change Password'}>
      <Formik
        initialValues={{ currentPassword: '', newPassword: '' }}
        validationSchema={changePasswordSchema}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={action('submit')}
        component={ChangePasswordForm}
      />
    </ModalForm>
  ))
  .add('Delete account', () => (
    <ModalForm title={'Delete account'}>
      <Formik
        initialValues={{ password: '' }}
        validationSchema={deleteAccountSchema}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={action('submit')}
        component={DeleteAccountForm}
      />
    </ModalForm>
  ))
