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

import { StatusCodes } from 'http-status-codes'
import { get } from 'lodash-es'

import { ErrorEvent } from './types'

export const isUnauthorized = (detail: ErrorEvent) => {
  const status = get(detail, 'error.status', null)
  if (!status) {
    return null
  }
  return status === StatusCodes.UNAUTHORIZED
}

export const isPushSyncError = (detail: ErrorEvent) => {
  return detail.direction === 'push' && detail.error
}

export const isPullSyncError = (detail: ErrorEvent) => {
  // error.status is undefined for longpoll errors
  const status = get(detail, 'error.status', null)
  if (!status) {
    return null
  }
  return Boolean(detail.direction === 'pull' && status)
}

export const isSyncTimeoutError = (detail: ErrorEvent) => {
  const status = get(detail, 'error.status', null)
  const reason = get(detail, 'error.reason', null)
  return (
    status === StatusCodes.INTERNAL_SERVER_ERROR && reason === 'TimeoutError'
  )
}

export const isWriteError = (detail: ErrorEvent) => {
  const status: number = get(detail, 'error.status', 0)
  return status >= 400
}

export const getPushSyncErrorMessage = (detail: ErrorEvent) => {
  const status = get(detail, 'error.status')

  switch (status) {
    case StatusCodes.BAD_REQUEST:
    case StatusCodes.FORBIDDEN:
      return `Syncing your changes failed due to invalid data.`

    case StatusCodes.NOT_FOUND:
      return `Syncing your changes failed because of missing data.`

    case StatusCodes.CONFLICT:
      return `Syncing your changes failed due to a data conflict.`

    case StatusCodes.INTERNAL_SERVER_ERROR:
      return `Syncing your changes failed due to a server error on our end.`
  }

  return `Syncing your changes failed.`
}
