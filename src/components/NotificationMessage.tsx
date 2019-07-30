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

import { Button } from '@manuscripts/style-guide'
import React, { useContext } from 'react'
import {
  NotificationComponent,
  NotificationContext,
} from './NotificationProvider'
import {
  NotificationActions,
  NotificationHead,
  NotificationIcon,
  NotificationMessage,
  NotificationPrompt,
  NotificationTitle,
} from './Notifications'

interface CreateNotificationProps {
  message: string
}

export const createNotification = ({
  message,
}: CreateNotificationProps): NotificationComponent => props => (
  <NotificationPrompt>
    <NotificationHead>
      <NotificationIcon />
      <NotificationMessage>
        <NotificationTitle>{message}</NotificationTitle>
      </NotificationMessage>
    </NotificationHead>
    <NotificationActions>
      <Button onClick={props.removeNotification}>Dismiss</Button>
    </NotificationActions>
  </NotificationPrompt>
)

interface Props {
  message: string
  id: string
}

export const Notification: React.FC<Props> = ({ children, message, id }) => {
  const { showNotification } = useContext(NotificationContext)

  showNotification(
    id,
    createNotification({
      message,
    })
  )

  return <>{children}</>
}
