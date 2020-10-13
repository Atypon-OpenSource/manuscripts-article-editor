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

import { PrimaryButton, SecondaryButton } from '@manuscripts/style-guide'
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
}: CreateUpdateReadyNotificationProps): NotificationComponent => (props) => (
  <NotificationPrompt>
    <NotificationHead>
      <NotificationIcon />
      <NotificationMessage>
        <NotificationTitle>
          A new version of the app is available on refreshing.
        </NotificationTitle>
        <NotificationLink href={`${config.discourse.host}/c/updates`}>
          What&apos;s new?
        </NotificationLink>
      </NotificationMessage>
    </NotificationHead>
    <NotificationActions>
      <SecondaryButton onClick={props.removeNotification}>
        Dismiss
      </SecondaryButton>
      <PrimaryButton onClick={handleAccept}>Refresh</PrimaryButton>
    </NotificationActions>
  </NotificationPrompt>
)
