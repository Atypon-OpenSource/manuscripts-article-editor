import { Formik, FormikConfig } from 'formik'
import React from 'react'
import AuthButtonContainer from '../containers/AuthButtonContainer'
import FooterContainer from '../containers/FooterContainer'

import AlertMessage from './AlertMessage'
import {
  AuthenticationContainer,
  GoogleLogin,
  // OrcidLogin,
} from './Authentication'
import { LoginForm, LoginValues } from './LoginForm'
import { Centered } from './Page'

interface Props {
  verificationMessage: string
  loginMessage: string | null
}

const LoginPage: React.SFC<FormikConfig<LoginValues> & Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loginMessage,
  verificationMessage,
}) => (
  <Centered>
    {!!verificationMessage &&
      verificationMessage ===
        'Account verification failed. Is the account already verified?' && (
        <AlertMessage type={'error'}>{verificationMessage}</AlertMessage>
      )}
    {!!verificationMessage &&
      verificationMessage === 'Your account is now verified.' && (
        <AlertMessage type={'info'}>{verificationMessage}</AlertMessage>
      )}
    {loginMessage && (
      <AlertMessage type={'warning'}>{loginMessage}</AlertMessage>
    )}
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
