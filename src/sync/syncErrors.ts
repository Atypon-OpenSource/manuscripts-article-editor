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
import config from '../config'
import { CollectionEvent } from './types'

const SUPPORT_EMAIL = config.support.email

type State = CollectionEvent[]
interface Action {
  type: string
  event?: CollectionEvent
}

/* tslint:disable:cyclomatic-complexity */
export default (state: State = [], action: Action): State => {
  if (action.type === 'reset') {
    return []
  }

  if (action.type !== 'event' || !action.event) return state

  const existingIndex = state.findIndex(
    existing =>
      existing.detail.direction === action.event!.detail.direction &&
      existing.detail.collection === action.event!.detail.collection
  )

  if (existingIndex === -1 && action.event.type === 'error') {
    return state.concat(action.event)
  }
  if (action.event.type === 'error') {
    return state.map((existing, i) =>
      i === existingIndex ? action.event! : existing
    )
  }
  if (existingIndex !== -1 && action.event.type === 'complete') {
    return state.filter((_, i) => i !== existingIndex)
  }

  return state
}
/* tslint:enable:cyclomatic-complexity */

export const isUnauthorized = (event: CollectionEvent) => {
  const error = get(event, 'detail.error', null)
  if (!error) return null
  return error.status === HttpStatusCodes.UNAUTHORIZED
}

export const isPushSyncError = (event: CollectionEvent) => {
  return event.detail.direction === 'push' && event.detail.error
}

export const isPullSyncError = (event: CollectionEvent) => {
  const error = get(event, 'detail.error', null)
  if (!error) return null
  // error.status is undefined for longpoll errors
  return Boolean(event.detail.direction === 'pull' && error && error.status)
}

export const isSyncTimeoutError = (event: CollectionEvent) => {
  const error = get(event, 'detail.error', null)
  if (!error) return false
  return (
    error.status === HttpStatusCodes.INTERNAL_SERVER_ERROR &&
    error.reason === 'TimeoutError'
  )
}

export const getPushSyncErrorMessage = (event: CollectionEvent) => {
  const status = get(event, 'detail.error.status')

  switch (status) {
    case HttpStatusCodes.BAD_REQUEST:
      return `Syncing your changes failed due to invalid data. Please contact ${SUPPORT_EMAIL}.`

    case HttpStatusCodes.NOT_FOUND:
      return `Syncing your changes failed because of missing data. Please contact ${SUPPORT_EMAIL}.`

    case HttpStatusCodes.CONFLICT:
      return `Syncing your changes failed due to a data conflict. Please retry.`

    case HttpStatusCodes.INTERNAL_SERVER_ERROR:
      return `Syncing your changes failed due to a server error on our end. Please contact ${SUPPORT_EMAIL}.`
  }

  return `Something's wrong, syncing your changes isn't working right now. Please contact ${SUPPORT_EMAIL}`
}
