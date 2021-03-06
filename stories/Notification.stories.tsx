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

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { createBrowserHistory } from 'history'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import { Notifications } from '../src/components/Notifications'
import { createUpdateReadyNotification } from '../src/components/ServiceWorker'
import SyncNotification from '../src/sync/SyncNotification'

const routeProps: RouteComponentProps = {
  history: createBrowserHistory(),
  match: {
    isExact: true,
    params: {},
    path: '',
    url: '',
  },
  location: {
    key: 'test',
    hash: '',
    pathname: '/projects',
    search: '',
    state: {},
  },
}

storiesOf('Notification', module).add('ServiceWorker', () => (
  <Notifications
    items={[
      {
        id: 'update-ready-1',
        notification: createUpdateReadyNotification({
          handleAccept: action('accept'),
          id: 'story',
        }),
      },
      {
        id: 'update-ready-2',
        notification: createUpdateReadyNotification({
          handleAccept: action('accept'),
          id: 'story',
        }),
      },
      {
        id: 'update-ready-3',
        notification: createUpdateReadyNotification({
          handleAccept: action('accept'),
          id: 'story',
        }),
      },
    ]}
    removeNotification={action('dismiss')}
    {...routeProps}
  />
))

storiesOf('SyncNotification', module)
  .add('basic', () => (
    <SyncNotification
      title="You best watch yourself"
      buttonText="Sounds good"
      buttonAction={action('handle plain button click')}
    />
  ))
  .add('with primary button', () => (
    <SyncNotification
      title="Something is wrong, but we have a solution"
      info="Click the primary button to give us permission"
      buttonText="Cancel"
      buttonAction={action('handle plain button click')}
      primaryButtonText="Go ahead"
      primaryButtonAction={action('handle primary button click')}
    />
  ))
  .add('with diagnostics', () => (
    <SyncNotification
      title="Uh-oh, this is really bad"
      info={[
        <span style={{ color: 'red' }} key={0}>
          One possible action
        </span>,
        <span style={{ color: 'blue' }} key={1}>
          Another possible action
        </span>,
      ]}
      buttonText="Cancel"
      buttonAction={action('handle plain button click')}
    />
  ))
