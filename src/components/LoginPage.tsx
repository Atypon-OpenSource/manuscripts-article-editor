import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import FooterContainer from '../containers/FooterContainer'
import { AuthContainer, GoogleLogin, OrcidLogin } from './Authentication'
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

    <AuthContainer>
      <div>Sign in with</div>
      <div>
        <GoogleLogin />
        <OrcidLogin />
      </div>
    </AuthContainer>

    <FooterContainer />
  </React.Fragment>
)

export default LoginPage
