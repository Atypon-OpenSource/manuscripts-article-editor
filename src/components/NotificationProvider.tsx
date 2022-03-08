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

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// import { useHistory, useLocation, useParams } from 'react-router-dom'
import config from '../config'
import SyncNotificationManager from '../sync/SyncNotificationManager'
import { Notifications } from './Notifications'

export type NotificationComponent<
  P = Record<string, unknown>
> = React.ComponentType<NotificationProps & P>

export type ShowNotification = (
  id: string,
  component: NotificationComponent
) => void

export type RemoveNotification = (id: string) => void

export interface NotificationProps {
  removeNotification: () => void
}

export interface NotificationValue {
  removeNotification: RemoveNotification
  showNotification: ShowNotification
}

export interface NotificationItem {
  id: string
  notification: NotificationComponent
}

export const NotificationContext = React.createContext<NotificationValue>({
  showNotification: () => null,
  removeNotification: () => null,
})

interface State {
  notifications: NotificationItem[]
}

export const NotificationProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<State>({
    notifications: [],
  })

  const showNotification: ShowNotification = (id, notification) => {
    setState((state) => {
      const item: NotificationItem = { id, notification }

      return {
        ...state,
        notifications: [
          item,
          ...state.notifications.filter((item) => item.id !== id),
        ],
      }
    })
  }

  const removeNotification = (id: string) => {
    setState((state) => ({
      ...state,
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    }))
  }

  const value: NotificationValue = {
    removeNotification,
    showNotification,
  }

  // const history = useHistory()
  // const location = useLocation()

  const renderNotifications = () => {
    const notifications = config.rxdb.enabled
      ? state.notifications.concat({
          id: 'sync',
          notification: SyncNotificationManager,
        })
      : state.notifications

    if (!notifications.length) {
      return null
    }

    return ReactDOM.createPortal(
      <Notifications
        items={notifications}
        removeNotification={removeNotification}
      />,
      document.getElementById('notifications')!
    )
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {renderNotifications()}
    </NotificationContext.Provider>
  )
}
