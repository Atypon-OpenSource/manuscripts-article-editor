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

import { Button, PrimaryButton } from '@manuscripts/style-guide'
import React, { MouseEventHandler, useContext } from 'react'
import { Workbox } from 'workbox-window'
import config from '../config'
import {
  NotificationComponent,
  NotificationContext,
} from './NotificationProvider'
import {
  NotificationActions,
  NotificationHead,
  NotificationIcon,
  NotificationLink,
  NotificationMessage,
  NotificationPrompt,
  NotificationTitle,
} from './Notifications'

export const ServiceWorker: React.FC = ({ children }) => {
  if (config.serviceworker && 'serviceWorker' in navigator) {
    const { showNotification } = useContext(NotificationContext)

    const wb = new Workbox('/service-worker.js')

    // Show a notification the first time the ServiceWorker is activated
    // wb.addEventListener('activated', event => {
    //   if (!event.isUpdate) {
    //     showNotification('sw-active', OfflineReadyNotification)
    //   }
    // })

    // Show a notification when a new version is waiting to take control
    wb.addEventListener('waiting', () => {
      const id = 'sw-active'

      showNotification(
        id,
        createUpdateReadyNotification({
          id,
          handleAccept: () => {
            wb.addEventListener('controlling', () => {
              window.location.reload()
            })

            wb.messageSW({ type: 'SKIP_WAITING' })
          },
        })
      )
    })

    wb.register()
  }

  return <>{children}</>
}

// export const OfflineReadyNotification: NotificationComponent = props => (
//   <NotificationPrompt>
//     <NotificationHead>
//       <NotificationIcon />
//       <NotificationMessage>
//         <NotificationTitle>Offline editing is now available!</NotificationTitle>
//       </NotificationMessage>
//     </NotificationHead>
//     <NotificationActions>
//       <PrimaryButton onClick={props.removeNotification}>Awesome!</PrimaryButton>
//     </NotificationActions>
//   </NotificationPrompt>
// )

interface CreateUpdateReadyNotificationProps {
  handleAccept: MouseEventHandler
  id: string
}

export const createUpdateReadyNotification = ({
  handleAccept,
  id,
}: CreateUpdateReadyNotificationProps): NotificationComponent => props => (
  <NotificationPrompt>
    <NotificationHead>
      <NotificationIcon />
      <NotificationMessage>
        <NotificationTitle>
          A new version of the app is available on refreshing.
        </NotificationTitle>
        <NotificationLink href={config.discourse.host}>
          What's new?
        </NotificationLink>
      </NotificationMessage>
    </NotificationHead>
    <NotificationActions>
      <Button onClick={props.removeNotification}>Dismiss</Button>
      <PrimaryButton onClick={handleAccept}>Refresh</PrimaryButton>
    </NotificationActions>
  </NotificationPrompt>
)
