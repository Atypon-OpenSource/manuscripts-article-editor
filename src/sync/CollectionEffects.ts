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

import { channels } from '../channels'
import config from '../config'
import { refreshSyncSessions } from '../lib/api'
import { postWebkitMessage } from '../lib/native'
import CollectionManager from './CollectionManager'
import { isUnauthorized } from './syncErrors'
import { Action, ErrorEvent } from './types'

let suspend = false

export default (dispatch: (action: Action) => void) => (action: Action) => {
  /* tslint:disable:no-console */
  if (config.logSyncEvents) {
    if (action.payload.error) {
      console.error(action.payload.error)
    }
    console.log(action)
  }
  /* tslint:enable:no-console */

  if (suspend) {
    dispatch(action)
    return
  }

  if (isUnauthorized(action.payload as ErrorEvent)) {
    suspend = true

    if (config.native) {
      postWebkitMessage('sync', {})
    } else {
      refreshSyncSessions()
        .then(() => {
          suspend = false
          CollectionManager.restartAll()
        })
        .catch(() => {
          suspend = false
          dispatch(action)
        })
    }
    return
  }

  if (action.payload.broadcast) {
    // dispatch also between other tabs between tabs.
    channels.syncState.postMessage(JSON.stringify(action))
  }
}
