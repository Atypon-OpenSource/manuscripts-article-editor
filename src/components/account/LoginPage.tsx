import { Formik, FormikConfig } from 'formik'
import React from 'react'
import AuthButtonContainer from './AuthButtonContainer'
import FooterContainer from './FooterContainer'

import { AlertMessageType } from '../AlertMessage'
import { Centered } from '../Page'
import {
  AuthenticationContainer,
  GoogleLogin,
  // OrcidLogin,
} from './Authentication'
import { LoginForm, LoginValues } from './LoginForm'
import {
  GoogleErrorMessage,
  LoginWarning,
  ResendVerificationDataMessage,
  VerificationMessage,
} from './LoginPageErrorsAndMessages'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

interface Props {
  verificationMessage?: string
  loginMessage?: string
  resendVerificationData?: ResendVerificationData
  googleLoginError?: string
  resendVerificationEmail: (email: string) => void
}

const LoginPageMessage: React.SFC<Props> = ({
  verificationMessage,
  loginMessage,
  resendVerificationData,
  googleLoginError,
  resendVerificationEmail,
}) => (
  <React.Fragment>
    {verificationMessage && (
      <VerificationMessage verificationMessage={verificationMessage} />
    )}
    {loginMessage && <LoginWarning loginWarning={loginMessage} />}
    {googleLoginError && (
      <GoogleErrorMessage googleLoginError={googleLoginError} />
    )}
    {resendVerificationData && (
      <ResendVerificationDataMessage
        resendVerificationData={resendVerificationData}
        resendVerificationEmail={resendVerificationEmail}
      />
    )}
  </React.Fragment>
)

const LoginPage: React.SFC<FormikConfig<LoginValues> & Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  verificationMessage,
  googleLoginError,
  loginMessage,
  resendVerificationData,
  resendVerificationEmail,
}) => (
  <Centered>
    <LoginPageMessage
      verificationMessage={verificationMessage}
      googleLoginError={googleLoginError}
      loginMessage={loginMessage}
      resendVerificationData={resendVerificationData}
      resendVerificationEmail={resendVerificationEmail}
    />
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
