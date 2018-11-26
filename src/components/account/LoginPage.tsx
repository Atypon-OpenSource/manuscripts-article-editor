import { Formik, FormikConfig } from 'formik'
import React from 'react'

import { Centered } from '../Page'
import AuthButtonContainer from './AuthButtonContainer'
import { AuthenticationContainer, GoogleLogin } from './Authentication'
import FooterContainer from './FooterContainer'
import { LoginForm, LoginValues } from './LoginForm'

const LoginPage: React.FunctionComponent<FormikConfig<LoginValues>> = ({
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
