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

import * as HttpStatusCodes from 'http-status-codes'
import { get } from 'lodash-es'
import { CollectionEvent, CollectionEventDetails } from './types'

interface State {
  allEvents: CollectionEventDetails[]
  newEvents: CollectionEventDetails[]
}

interface Action {
  type: string
  event?: CollectionEvent
  isOffline?: boolean
}

/* tslint:disable:cyclomatic-complexity */
export default (state: State, action: Action): State => {
  switch (action.type) {
    case 'event': {
      if (action.isOffline || !action.event) return state
      return {
        allEvents: [...state.allEvents, action.event.detail],
        newEvents: [...state.newEvents, action.event.detail],
      }
    }

    case 'reset': {
      return {
        ...state,
        newEvents: [],
      }
    }
  }

  return state
}
/* tslint:enable:cyclomatic-complexity */

export const getInitialState = (): State => ({
  allEvents: [],
  newEvents: [],
})

export const isUnauthorized = (detail: CollectionEventDetails) => {
  const status = get(detail, 'error.status', null)
  if (!status) return null
  return status === HttpStatusCodes.UNAUTHORIZED
}

export const isPushSyncError = (detail: CollectionEventDetails) => {
  return detail.direction === 'push' && detail.error
}

export const isPullSyncError = (detail: CollectionEventDetails) => {
  // error.status is undefined for longpoll errors
  const status = get(detail, 'error.status', null)
  // also ignore the unhelpful "aborting" errors with empty aborting array
  const errors = get(detail, 'error.result.errors', [])
  if (!status) return null
  return Boolean(detail.direction === 'pull' && status && errors.length)
}

export const isSyncTimeoutError = (detail: CollectionEventDetails) => {
  const status = get(detail, 'error.status', null)
  const reason = get(detail, 'error.reason', null)
  return (
    status === HttpStatusCodes.INTERNAL_SERVER_ERROR &&
    reason === 'TimeoutError'
  )
}

export const isWriteError = (detail: CollectionEventDetails) => {
  const operation = get(detail, 'operation', null)
  return Boolean(operation)
}

export const getPushSyncErrorMessage = (detail: CollectionEventDetails) => {
  const status = get(detail, 'error.status')

  switch (status) {
    case HttpStatusCodes.BAD_REQUEST:
      return `Syncing your changes failed due to invalid data.`

    case HttpStatusCodes.NOT_FOUND:
      return `Syncing your changes failed because of missing data.`

    case HttpStatusCodes.CONFLICT:
      return `Syncing your changes failed due to a data conflict.`

    case HttpStatusCodes.INTERNAL_SERVER_ERROR:
      return `Syncing your changes failed due to a server error on our end.`
  }

  return `Syncing your changes failed.`
}
