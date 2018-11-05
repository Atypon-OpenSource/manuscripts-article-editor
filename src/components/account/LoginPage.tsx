import { Formik, FormikConfig } from 'formik'
import React from 'react'
import AuthButtonContainer from './AuthButtonContainer'
import FooterContainer from './FooterContainer'

import { Centered } from '../Page'
import {
  AuthenticationContainer,
  GoogleLogin,
  // OrcidLogin,
} from './Authentication'
import { LoginForm, LoginValues } from './LoginForm'

const LoginPage: React.SFC<FormikConfig<LoginValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
      component={LoginForm}
    />

    <AuthenticationContainer>
      <div>Sign in with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
        {/*<AuthButtonContainer component={OrcidLogin} />*/}
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </Centered>
)

export default LoginPage
