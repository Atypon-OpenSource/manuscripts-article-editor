import { Formik, FormikConfig } from 'formik'
import React from 'react'
import AuthButtonContainer from './AuthButtonContainer'
import FooterContainer from './FooterContainer'

import config from '../../config'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { Centered } from '../Page'
import {
  AuthenticationContainer,
  GoogleLogin,
  // OrcidLogin,
} from './Authentication'
import { LoginForm, LoginValues } from './LoginForm'

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
  infoLoginMessage?: string
}

interface LoginMessageProps {
  loginMessage?: string
  googleLoginError?: string
  infoLoginMessage?: string
}

const LoginPageMessage: React.SFC<LoginMessageProps> = ({
  loginMessage,
  googleLoginError,
  infoLoginMessage,
}) => (
  <React.Fragment>
    {loginMessage && (
      <AlertMessage type={AlertMessageType.warning}>
        {loginMessage}
      </AlertMessage>
    )}
    {googleLoginError && (
      <React.Fragment>
        {googleLoginError === 'user-not-found' ? (
          <AlertMessage type={AlertMessageType.error}>
            {`A user record matching your identity at Google was unexpectedly not
        found. Please contact ${config.support.email} if this persists.`}
          </AlertMessage>
        ) : (
          <AlertMessage type={AlertMessageType.error}>
            {`An error occurred while logging in with Google, please contact ${
              config.support.email
            }`}
          </AlertMessage>
        )}
      </React.Fragment>
    )}
    {infoLoginMessage && (
      <AlertMessage type={AlertMessageType.info}>
        {infoLoginMessage}
      </AlertMessage>
    )}
  </React.Fragment>
)

interface VerificationMessageProps {
  verificationMessage?: string
  resendVerificationData?: ResendVerificationData
  resendVerificationEmail: (email: string) => void
}

const VerificationMessage: React.SFC<VerificationMessageProps> = ({
  verificationMessage,
  resendVerificationData,
  resendVerificationEmail,
}) => (
  <React.Fragment>
    {!!verificationMessage &&
      verificationMessage ===
        'Account verification failed. Is the account already verified?' && (
        <AlertMessage type={AlertMessageType.error}>
          {verificationMessage}
        </AlertMessage>
      )}
    {!!verificationMessage &&
      verificationMessage === 'Your account is now verified.' && (
        <AlertMessage type={AlertMessageType.info}>
          {verificationMessage}
        </AlertMessage>
      )}
    {!!resendVerificationData && (
      <AlertMessage
        type={resendVerificationData.type}
        dismissButton={{
          text: 'Re-send verification email.',
          action: () => resendVerificationEmail(resendVerificationData.email),
        }}
      >
        {resendVerificationData.message}
      </AlertMessage>
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
  infoLoginMessage,
}) => (
  <Centered>
    <VerificationMessage
      verificationMessage={verificationMessage}
      resendVerificationData={resendVerificationData}
      resendVerificationEmail={resendVerificationEmail}
    />
    <LoginPageMessage
      googleLoginError={googleLoginError}
      loginMessage={loginMessage}
      infoLoginMessage={infoLoginMessage}
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
