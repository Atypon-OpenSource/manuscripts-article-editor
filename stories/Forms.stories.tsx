/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import { ModalForm } from '../src/components/ModalForm'
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
    <ModalForm title={'Change Password'} handleClose={action('close')}>
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
    <ModalForm title={'Delete account'} handleClose={action('close')}>
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
  <ModalForm title={'Feedback'} handleClose={action('close')}>
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
