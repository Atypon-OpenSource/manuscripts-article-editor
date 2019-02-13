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
import React from 'react'
import LoginPage from '../src/components/account/LoginPage'
import PasswordPage from '../src/components/account/PasswordPage'
import RecoverPage from '../src/components/account/RecoverPage'
import SignupPage from '../src/components/account/SignupPage'
import {
  loginSchema,
  passwordSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'

storiesOf('Account/Pages', module)
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
