import React from 'react'
import config from '../../config'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { NetworkErrorMessage } from '../Messages'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

export const GoogleErrorMessage: React.SFC<{ googleLoginError: string }> = ({
  googleLoginError,
}) => {
  switch (googleLoginError) {
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

export const VerificationMessage: React.SFC<{
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

export const ResendVerificationDataMessage: React.SFC<{
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

export const LoginWarning: React.SFC<{ loginWarning: string }> = ({
  loginWarning,
}) => (
  <AlertMessage type={AlertMessageType.warning}>{loginWarning}</AlertMessage>
)

export const LoginInfo: React.SFC<{ loginInfo: string }> = ({ loginInfo }) => (
  <AlertMessage type={AlertMessageType.info}>{loginInfo}</AlertMessage>
)

export const NetworkMessage: React.SFC = () => (
  <AlertMessage type={AlertMessageType.error}>
    <NetworkErrorMessage />
  </AlertMessage>
)
