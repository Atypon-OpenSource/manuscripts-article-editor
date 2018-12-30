import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'
import {
  ChangePasswordForm,
  ChangePasswordValues,
} from '../src/components/account/ChangePasswordForm'
import {
  DeleteAccountForm,
  DeleteAccountValues,
} from '../src/components/account/DeleteAccountForm'
import {
  FeedbackForm,
  FeedbackValues,
} from '../src/components/account/FeedbackForm'
import { LoginForm, LoginValues } from '../src/components/account/LoginForm'
import {
  PasswordForm,
  PasswordValues,
} from '../src/components/account/PasswordForm'
import {
  RecoverForm,
  RecoverValues,
} from '../src/components/account/RecoverForm'
import { SignupForm, SignupValues } from '../src/components/account/SignupForm'
import ModalForm from '../src/components/ModalForm'
import {
  changePasswordSchema,
  deleteAccountSchema,
  feedbackSchema,
  loginSchema,
  passwordSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'

storiesOf('Account/Forms/Pages', module)
  .add('Sign up', () => (
    <React.Fragment>
      <Formik<SignupValues>
        initialValues={{
          name: '',
          email: '',
          password: '',
          allowsTracking: false,
        }}
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
    <Formik<LoginValues>
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
    <Formik<RecoverValues>
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
    <Formik<PasswordValues>
      initialValues={{ password: '' }}
      validationSchema={passwordSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={action('submit')}
      component={PasswordForm}
    />
  ))

storiesOf('Account/Forms/Modal', module)
  .add('Change password', () => (
    <ModalForm title={'Change Password'}>
      <Formik<ChangePasswordValues>
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
      <Formik<DeleteAccountValues>
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

storiesOf('Feedback', module).add('Feedback', () => (
  <ModalForm title={'feedback'}>
    <Formik<FeedbackValues>
      initialValues={{
        message: '',

        title: '',
      }}
      validationSchema={feedbackSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={action('submit')}
      component={FeedbackForm}
    />
  </ModalForm>
))
