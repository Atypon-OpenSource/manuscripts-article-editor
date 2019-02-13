/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
