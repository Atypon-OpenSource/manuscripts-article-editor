import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import AuthenticationButtonContainer from '../containers/AuthButtonContainer'
import FooterContainer from '../containers/FooterContainer'
import {
  AuthenticationContainer,
  GoogleLogin,
  OrcidLogin,
} from './Authentication'
import { LoginForm, LoginValues } from './LoginForm'

const LoginPage: React.SFC<FormikConfig<LoginValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <React.Fragment>
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
        <AuthenticationButtonContainer component={GoogleLogin} />
        <AuthenticationButtonContainer component={OrcidLogin} />
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </React.Fragment>
)

export default LoginPage
