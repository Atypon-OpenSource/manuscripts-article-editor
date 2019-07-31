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

import AttentionOrange from '@manuscripts/assets/react/AttentionOrange'
import { Model } from '@manuscripts/manuscripts-json-schema'
import { Button } from '@manuscripts/style-guide'
import { History, LocationDescriptor } from 'history'
import * as HttpStatusCodes from 'http-status-codes'
import React, { useCallback, useContext, useEffect } from 'react'
import {
  NotificationComponent,
  NotificationContext,
} from '../components/NotificationProvider'
import {
  NotificationActions,
  NotificationHead,
  NotificationMessage,
  NotificationPrompt,
  NotificationTitle,
} from '../components/Notifications'
import { TokenActions } from '../data/TokenData'
import { Collection, isAxiosError, isReplicationError } from './Collection'
import { CollectionEventListener } from './types'

const buildNotificationID = <T extends Model>(collection: Collection<T>) =>
  `sync-login-${collection.collectionName}`

const isUnauthorized = (data?: { status?: number }) =>
  data && data.status === HttpStatusCodes.UNAUTHORIZED

const isSyncTimeoutError = (data?: { status?: number; reason?: string }) =>
  data &&
  data.status === HttpStatusCodes.INTERNAL_SERVER_ERROR &&
  data.reason === 'TimeoutError'

// const isAborting = (data?: { result?: { status?: string } }) =>
//   data && data.result && data.result.status === 'aborting'

interface LocationState {
  from: LocationDescriptor
}

const SYNC_ERROR_NOTIFICATION_ID = 'sync-error'

export const SyncNotification = <T extends Model>({
  collection,
  history,
  location,
  tokenActions,
}: {
  collection: Collection<T>
  history: History
  location: LocationDescriptor
  tokenActions: TokenActions
}) => {
  const { showNotification, removeNotification } = useContext(
    NotificationContext
  )

  const handleLogin = useCallback(() => {
    tokenActions.delete()

    removeNotification(SYNC_ERROR_NOTIFICATION_ID)

    const locationDescriptor: LocationDescriptor<LocationState> = {
      pathname: '/login',
      state: {
        from: location,
      },
    }

    history.push(locationDescriptor)
  }, [])

  const handleRetry = useCallback(() => {
    removeNotification(SYNC_ERROR_NOTIFICATION_ID)
    restartSyncing().catch(error => {
      // tslint:disable-next-line:no-console
      console.error(error)
    })
  }, [removeNotification])

  // TODO: show a single notification and restart all collections?
  const restartSyncing = useCallback(
    () => collection.cancelReplications().then(() => collection.startSyncing()),
    [collection]
  )

  useEffect(() => {
    const notificationID = buildNotificationID(collection)

    const SyncLoginNotification: NotificationComponent = () => (
      <NotificationPrompt>
        <NotificationHead>
          <AttentionOrange />
          <NotificationMessage>
            <NotificationTitle>
              Please sign in again to sync your changes
            </NotificationTitle>
          </NotificationMessage>
        </NotificationHead>
        <NotificationActions>
          <Button onClick={handleLogin}>Sign in</Button>
        </NotificationActions>
      </NotificationPrompt>
    )

    const SyncRetryNotification: NotificationComponent = () => (
      <NotificationPrompt>
        <NotificationHead>
          <AttentionOrange />
          <NotificationMessage>
            <NotificationTitle>Syncing your changes failed</NotificationTitle>
          </NotificationMessage>
        </NotificationHead>
        <NotificationActions>
          <Button onClick={handleRetry}>Retry</Button>
        </NotificationActions>
      </NotificationPrompt>
    )

    const SyncTimeoutNotification: NotificationComponent = () => (
      <NotificationPrompt>
        <NotificationHead>
          <AttentionOrange />
          <NotificationMessage>
            <NotificationTitle>
              Unable to connect to sync server
            </NotificationTitle>
          </NotificationMessage>
        </NotificationHead>
        <NotificationActions>
          <Button onClick={handleRetry}>Retry</Button>
        </NotificationActions>
      </NotificationPrompt>
    )

    const handleError: CollectionEventListener = collectionError => {
      const { error } = collectionError.detail

      if (error) {
        if (isAxiosError(error)) {
          if (isUnauthorized(error.response)) {
            // unauthorised response from refreshSyncSessions request to the API
            showNotification(SYNC_ERROR_NOTIFICATION_ID, SyncLoginNotification)
          }
        } else if (isReplicationError(error)) {
          if (isUnauthorized(error)) {
            // unauthorised response from request to Sync Gateway
            showNotification(SYNC_ERROR_NOTIFICATION_ID, SyncLoginNotification)
          } else if (isSyncTimeoutError(error)) {
            // request to Sync Gateway timed out
            showNotification(
              SYNC_ERROR_NOTIFICATION_ID,
              SyncTimeoutNotification
            )
          } else {
            showNotification(SYNC_ERROR_NOTIFICATION_ID, SyncRetryNotification)
          }
        }

        // TODO: handle other types of errors
      }
    }

    // TODO: pull sync failures are set as "complete" so things can continue
    // const handleComplete = () => {
    //   removeNotification(SYNC_ERROR_NOTIFICATION_ID)
    //   removeNotification(notificationID)
    // }

    collection.addEventListener('error', handleError)
    // collection.addEventListener('complete', handleComplete)

    return () => {
      collection.removeEventListener('error', handleError)
      // collection.removeEventListener('complete', handleComplete)
      removeNotification(SYNC_ERROR_NOTIFICATION_ID)
      removeNotification(notificationID)
    }
  }, [collection, removeNotification])

  return null
}
