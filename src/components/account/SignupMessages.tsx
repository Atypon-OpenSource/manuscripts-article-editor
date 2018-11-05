import React from 'react'
import config from '../../config'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import {
  NetworkErrorMessage,
  SignupVerifyConflictMessage,
  SignupVerifyMessage,
  SignupVerifyResendFailureMessage,
  SignupVerifyResendSuccessMessage,
} from '../Messages'

interface UserDetails {
  email: string
}

interface Props {
  confirming: UserDetails | null
  resendSucceed: boolean | null
  existButNotVerified: UserDetails | null
  networkError: boolean | null
  resendVerificationEmail?: () => void
}

const SignupMessages: React.SFC<Props> = ({
  confirming,
  resendSucceed,
  existButNotVerified,
  resendVerificationEmail,
  networkError,
}) => {
  if (confirming) {
    if (resendSucceed === null) {
      return (
        <AlertMessage
          type={AlertMessageType.success}
          dismissButton={{
            text: 'Click here to re-send.',
            action: resendVerificationEmail,
          }}
        >
          <SignupVerifyMessage email={confirming.email} />
        </AlertMessage>
      )
    }

    return resendSucceed ? (
      <AlertMessage type={AlertMessageType.success}>
        <SignupVerifyResendSuccessMessage
          email={confirming.email}
          supportEmail={config.support.email}
        />
      </AlertMessage>
    ) : (
      <AlertMessage
        type={AlertMessageType.error}
        dismissButton={{
          text: 'Click here to retry.',
          action: resendVerificationEmail,
        }}
      >
        <SignupVerifyResendFailureMessage email={confirming.email} />
      </AlertMessage>
    )
  }

  if (existButNotVerified) {
    return (
      <AlertMessage type={AlertMessageType.warning}>
        <SignupVerifyConflictMessage email={existButNotVerified.email} />
      </AlertMessage>
    )
  }

  if (networkError) {
    return (
      <AlertMessage type={AlertMessageType.error}>
        <NetworkErrorMessage />
      </AlertMessage>
    )
  }

  return null
}

export default SignupMessages
