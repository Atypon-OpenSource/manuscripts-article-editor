import React from 'react'
import { AlertMessageType } from '../AlertMessage'
import {
  GatewayInaccessible,
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
  identityProviderError: string | null
  resendVerificationEmail: (email: string) => void
  infoLoginMessage: string | null
  networkError: boolean | null
  gatewayInaccessible: boolean | null
}

const LoginPageMessages: React.SFC<Props> = ({
  verificationMessage,
  loginMessage,
  resendVerificationData,
  identityProviderError,
  resendVerificationEmail,
  infoLoginMessage,
  networkError,
  gatewayInaccessible,
}) => (
  <React.Fragment>
    {verificationMessage && (
      <VerificationMessage verificationMessage={verificationMessage} />
    )}
    {loginMessage && <LoginWarning loginWarning={loginMessage} />}
    {identityProviderError && (
      <GoogleErrorMessage identityProviderError={identityProviderError} />
    )}
    {resendVerificationData && (
      <ResendVerificationDataMessage
        resendVerificationData={resendVerificationData}
        resendVerificationEmail={resendVerificationEmail}
      />
    )}
    {infoLoginMessage && <LoginInfo loginInfo={infoLoginMessage} />}
    {networkError && <NetworkMessage />}
    {gatewayInaccessible && <GatewayInaccessible />}
  </React.Fragment>
)

export default LoginPageMessages
