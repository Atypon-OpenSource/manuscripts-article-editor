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

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import SyncNotificationManager from '../sync/SyncNotificationManager'
import { Notifications } from './Notifications'

export type NotificationComponent<P = {}> = React.ComponentType<
  NotificationProps & P
>

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

export class NotificationProvider extends React.Component<{}, State> {
  private value: NotificationValue

  public constructor(props: {}) {
    super(props)

    this.value = {
      removeNotification: this.removeNotification,
      showNotification: this.showNotification,
    }

    this.state = {
      notifications: [],
    }
  }

  public render() {
    return (
      <NotificationContext.Provider value={this.value}>
        {this.props.children}
        {this.renderNotifications()}
      </NotificationContext.Provider>
    )
  }

  private showNotification: ShowNotification = (id, notification) => {
    this.setState(state => {
      const item: NotificationItem = { id, notification }

      return {
        ...state,
        notifications: [
          item,
          ...state.notifications.filter(item => item.id !== id),
        ],
      }
    })
  }

  private removeNotification = (id: string) => {
    this.setState(state => ({
      ...state,
      notifications: state.notifications.filter(
        notification => notification.id !== id
      ),
    }))
  }

  private renderNotifications = () => {
    const notifications = this.state.notifications.concat({
      id: 'sync',
      notification: SyncNotificationManager,
    })

    if (!notifications.length) return null

    return ReactDOM.createPortal(
      <BrowserRouter>
        <Notifications
          items={notifications}
          removeNotification={this.removeNotification}
        />
      </BrowserRouter>,
      document.getElementById('notifications')!
    )
  }
}
