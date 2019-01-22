import { Formik, FormikConfig } from 'formik'
import React from 'react'

import { Centered } from '../Page'
import AuthButtonContainer from './AuthButtonContainer'
import { AuthenticationContainer, GoogleLogin } from './Authentication'
import FooterContainer from './FooterContainer'
import { LoginForm, LoginValues } from './LoginForm'

interface Props {
  submitErrorType: string | null
}

const LoginPage: React.FunctionComponent<FormikConfig<LoginValues> & Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  submitErrorType,
}) => (
  <Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
      render={formikProps => (
        <LoginForm {...formikProps} submitErrorType={submitErrorType} />
      )}
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
