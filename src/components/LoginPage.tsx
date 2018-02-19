import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import AuthButtonContainer from '../containers/AuthButtonContainer'
import FooterContainer from '../containers/FooterContainer'
import {
  AuthenticationContainer,
  GoogleLogin,
  OrcidLogin,
} from './Authentication'
import { LoginForm, LoginValues } from './LoginForm'
import { Centered } from './Page'

const LoginPage: React.SFC<FormikConfig<LoginValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={false}
      onSubmit={onSubmit}
      component={LoginForm}
    />

    <AuthenticationContainer>
      <div>Sign in with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
        <AuthButtonContainer component={OrcidLogin} />
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </Centered>
)

export default LoginPage
