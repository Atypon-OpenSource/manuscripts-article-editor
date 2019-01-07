import { parse } from 'qs'
import React from 'react'
import AlertMessage, { AlertMessageType } from './AlertMessage'

export enum MessageBannerAction {
  resetPassword = 'reset-password',
}

const MessageBanner: React.FunctionComponent = () => {
  const { action } = parse(window.location.hash.substr(1))

  switch (action) {
    case MessageBannerAction.resetPassword:
      return (
        <AlertMessage type={AlertMessageType.success}>
          Password reset was successful.
        </AlertMessage>
      )

    default:
      return null
  }
}

export default MessageBanner
