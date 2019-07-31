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
import React, { useContext, useEffect } from 'react'
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

export const createNotification = ({
  id,
  message,
}: {
  id: string
  message: string
}): NotificationComponent => props => (
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

export const Notification: React.FC<{
  message: string
  id: string
}> = ({ children, message, id }) => {
  const { removeNotification, showNotification } = useContext(
    NotificationContext
  )

  useEffect(() => {
    showNotification(id, createNotification({ id, message }))

    return () => {
      removeNotification(id)
    }
  }, [id, message])

  return <>{children}</>
}
