import React from 'react'
import AlertMessage, { TextButton } from './AlertMessage'
import {
  SignupVerifyConflictMessage,
  SignupVerifyMessage,
  SignupVerifyResendFailureMessage,
  SignupVerifyResendSuccessMessage,
} from './Messages'

interface UserDetails {
  email: string
}

interface Props {
  confirming: UserDetails | null
  resendSucceed: boolean | null
  existButNotVerified: UserDetails | null
  resendVerificationEmail?: () => void
}

const SignupMessages: React.SFC<Props> = ({
  confirming,
  resendSucceed,
  existButNotVerified,
  resendVerificationEmail,
}) => {
  if (confirming) {
    if (resendSucceed === null) {
      return (
        <AlertMessage type={'success'}>
          <SignupVerifyMessage email={confirming.email} />
          <TextButton onClick={resendVerificationEmail}>
            Click here to re-send.
          </TextButton>
        </AlertMessage>
      )
    }

    return resendSucceed ? (
      <AlertMessage type={'success'}>
        <SignupVerifyResendSuccessMessage email={confirming.email} />
      </AlertMessage>
    ) : (
      <AlertMessage type={'error'}>
        <SignupVerifyResendFailureMessage email={confirming.email} />
        <TextButton onClick={resendVerificationEmail}>
          Click here to retry.
        </TextButton>
      </AlertMessage>
    )
  }

  if (existButNotVerified) {
    return (
      <AlertMessage type={'warning'}>
        <SignupVerifyConflictMessage email={existButNotVerified.email} />
      </AlertMessage>
    )
  }

  return null
}

export default SignupMessages
