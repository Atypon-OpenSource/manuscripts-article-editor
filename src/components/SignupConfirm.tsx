import * as React from 'react'
import { Centered } from './Page'

interface SignupConfirmProps {
  email: string
}

export const SignupConfirm: React.SFC<SignupConfirmProps> = ({ email }) => (
  <Centered>
    <p>
      An email has been sent to <b>{email}</b>.
    </p>
    <p>Follow the link in the email to verify your email address.</p>
  </Centered>
)
