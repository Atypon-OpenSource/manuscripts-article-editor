import React from 'react'
import config from '../../config'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { GatewayInaccessibleMessage, NetworkErrorMessage } from '../Messages'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

export const GoogleErrorMessage: React.FunctionComponent<{
  identityProviderError: string
}> = ({ identityProviderError }) => {
  switch (identityProviderError) {
    case 'user-not-found':
      return (
        <AlertMessage type={AlertMessageType.error}>
          {`A user record matching your identity at Google was unexpectedly not found. Please contact ${
            config.support.email
          } if this persists.`}
        </AlertMessage>
      )
    case 'validation-error':
      return (
        <AlertMessage type={AlertMessageType.error}>
          {`An invalid request was made when attempting to log in via Google. Please contact ${
            config.support.email
          } if this persists.`}
        </AlertMessage>
      )
    default:
      return (
        <AlertMessage type={AlertMessageType.error}>
          {`An error occurred while logging in with Google, please contact ${
            config.support.email
          }`}
        </AlertMessage>
      )
  }
}

export const VerificationMessage: React.FunctionComponent<{
  verificationMessage: string
}> = ({ verificationMessage }) => {
  switch (verificationMessage) {
    case 'Account verification failed. Is the account already verified?':
      return (
        <AlertMessage type={AlertMessageType.error}>
          {verificationMessage}
        </AlertMessage>
      )
    default:
      return (
        <AlertMessage type={AlertMessageType.info}>
          {verificationMessage}
        </AlertMessage>
      )
  }
}

export const ResendVerificationDataMessage: React.FunctionComponent<{
  resendVerificationData: ResendVerificationData
  resendVerificationEmail: (email: string) => void
}> = ({ resendVerificationData, resendVerificationEmail }) => (
  <AlertMessage
    type={resendVerificationData.type}
    dismissButton={{
      text: 'Re-send verification email.',
      action: () => resendVerificationEmail(resendVerificationData.email),
    }}
  >
    {resendVerificationData.message}
  </AlertMessage>
)

export const LoginWarning: React.FunctionComponent<{
  loginWarning: string
}> = ({ loginWarning }) => (
  <AlertMessage type={AlertMessageType.warning}>{loginWarning}</AlertMessage>
)

export const LoginInfo: React.FunctionComponent<{ loginInfo: string }> = ({
  loginInfo,
}) => <AlertMessage type={AlertMessageType.info}>{loginInfo}</AlertMessage>

export const NetworkMessage: React.FunctionComponent = () => (
  <AlertMessage type={AlertMessageType.error}>
    <NetworkErrorMessage />
  </AlertMessage>
)

export const GatewayInaccessible: React.FunctionComponent = () => (
  <AlertMessage type={AlertMessageType.error}>
    <GatewayInaccessibleMessage />
  </AlertMessage>
)
