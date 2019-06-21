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

import React from 'react'
import ReactDOM from 'react-dom'
import { Notifications } from './Notifications'

export type NotificationComponent = React.FunctionComponent<{
  removeNotification: () => void
}>

export type ShowNotification = (
  id: string,
  component: NotificationComponent
) => void

export interface NotificationProps {
  showNotification: ShowNotification
}

export interface NotificationItem {
  id: string
  notification: NotificationComponent
}

export const NotificationContext = React.createContext<NotificationProps>(
  {} as NotificationProps // tslint:disable-line:no-object-literal-type-assertion
)

interface State {
  notifications: NotificationItem[]
}

export class NotificationProvider extends React.Component<{}, State> {
  private value: NotificationProps

  public constructor(props: {}) {
    super(props)

    this.value = {
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
      const notifications = state.notifications.filter(item => item.id !== id)

      notifications.unshift({ id, notification })

      return {
        ...state,
        notifications,
      }
    })
  }

  private removeNotification = (id: string) => {
    this.setState({
      notifications: this.state.notifications.filter(
        notification => notification.id !== id
      ),
    })
  }

  private renderNotifications = () => {
    const { notifications } = this.state

    if (!notifications.length) return null

    return ReactDOM.createPortal(
      <Notifications
        items={notifications}
        removeNotification={this.removeNotification}
      />,
      document.getElementById('notifications')!
    )
  }
}
