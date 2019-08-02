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

import { Formik, FormikConfig } from 'formik'
import React from 'react'
import config from '../../config'
import { Centered } from '../Page'
import AuthButtonContainer from './AuthButtonContainer'
import {
  AuthenticationContainer,
  ConnectLogin,
  GoogleLogin,
} from './Authentication'
import FooterContainer from './FooterContainer'
import { SignupForm, SignupValues } from './SignupForm'

const SignupPage: React.FunctionComponent<FormikConfig<SignupValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Centered>
    <Formik<SignupValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
      component={SignupForm}
    />

    <AuthenticationContainer>
      <div>Sign up with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
        {config.connect.enabled && (
          <AuthButtonContainer component={ConnectLogin} />
        )}
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </Centered>
)

export default SignupPage
