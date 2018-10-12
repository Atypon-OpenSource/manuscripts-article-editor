import React from 'react'
import { Centered } from '../Page'

interface RecoverConfirmProps {
  email: string
}

export const RecoverConfirm: React.SFC<RecoverConfirmProps> = ({ email }) => (
  <Centered>
    <div>An email has been sent.</div>
    <div>Follow the link in the email to reset your password.</div>
  </Centered>
)
