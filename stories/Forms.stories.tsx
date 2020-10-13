/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
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
  PreferencesForm,
  PreferencesValues,
} from '../src/components/account/PreferencesForm'
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
  preferencesSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'
import { project } from './data/projects'

storiesOf('Account/Forms/Pages', module)
  .add('Sign up', () => (
    <React.Fragment>
      <Formik<SignupValues>
        initialValues={{
          name: '',
          email: '',
          password: '',
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
  .add('Delete account with projects', () => (
    <ModalForm title={'Delete account'} handleClose={action('close')}>
      <Formik<DeleteAccountValues>
        initialValues={{ password: '' }}
        validationSchema={deleteAccountSchema}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={action('submit')}
        render={(props) => (
          <DeleteAccountForm
            {...props}
            deletedProjects={[
              project,
              { ...project, title: undefined, _id: 'project-id-2' },
            ]}
          />
        )}
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

storiesOf('Preferences', module).add('Preferences', () => (
  <Formik<PreferencesValues>
    initialValues={{
      locale: 'en',
    }}
    validationSchema={preferencesSchema}
    isInitialValid={true}
    validateOnChange={false}
    validateOnBlur={false}
    onSubmit={action('submit')}
    component={PreferencesForm}
  />
))
