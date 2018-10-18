import { Formik, FormikConfig } from 'formik'
import React from 'react'
import AuthButtonContainer from './AuthButtonContainer'
import FooterContainer from './FooterContainer'

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
  verificationMessage: string
  loginMessage: string | null
  resendVerificationData: ResendVerificationData | null
  resendVerificationEmail: (email: string) => void
}

const LoginPage: React.SFC<FormikConfig<LoginValues> & Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loginMessage,
  verificationMessage,
  resendVerificationData,
  resendVerificationEmail,
}) => (
  <Centered>
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
    {loginMessage && (
      <AlertMessage type={AlertMessageType.warning}>
        {loginMessage}
      </AlertMessage>
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
