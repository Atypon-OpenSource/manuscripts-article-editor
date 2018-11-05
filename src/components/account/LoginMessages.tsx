import React from 'react'
import { AlertMessageType } from '../AlertMessage'
import {
  GoogleErrorMessage,
  LoginInfo,
  LoginWarning,
  NetworkMessage,
  ResendVerificationDataMessage,
  VerificationMessage,
} from './LoginPageErrorsAndMessages'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

interface Props {
  verificationMessage: string | null
  loginMessage: string | null
  resendVerificationData: ResendVerificationData | null
  googleLoginError: string | null
  resendVerificationEmail: (email: string) => void
  infoLoginMessage: string | null
  networkError: boolean | null
}

const LoginPageMessages: React.SFC<Props> = ({
  verificationMessage,
  loginMessage,
  resendVerificationData,
  googleLoginError,
  resendVerificationEmail,
  infoLoginMessage,
  networkError,
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
    {infoLoginMessage && <LoginInfo loginInfo={infoLoginMessage} />}
    {networkError && <NetworkMessage />}
  </React.Fragment>
)

export default LoginPageMessages
