/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import { parse } from 'qs'
import React from 'react'

export enum MessageBannerAction {
  resetPassword = 'reset-password',
  retrieveAccount = 'account-retrieved',
}
interface Props {
  errorMessage?: string
}

const MessageBanner: React.FunctionComponent<Props> = ({ errorMessage }) => {
  const { action } = parse(window.location.hash.substr(1))

  if (errorMessage) {
    return (
      <AlertMessage type={AlertMessageType.error}>{errorMessage}</AlertMessage>
    )
  }

  switch (action) {
    case MessageBannerAction.resetPassword:
      return (
        <AlertMessage type={AlertMessageType.success}>
          Password reset was successful.
        </AlertMessage>
      )
    case MessageBannerAction.retrieveAccount:
      return (
        <AlertMessage type={AlertMessageType.success}>
          Your account has been retrieved successfully. Your projects are now
          safe and you still have access to the projects you were invited to.
        </AlertMessage>
      )

    default:
      return null
  }
}

export default MessageBanner
