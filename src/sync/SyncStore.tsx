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

import React, {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'

import { channels } from '../channels'
import sessionId from '../lib/session-id'
import CollectionEffects from './CollectionEffects'
import collectionManager from './CollectionManager'
import reducer from './syncEvents'
import { Action, SyncState } from './types'

export interface Store {
  getState: () => SyncState
  dispatch: (action: Action) => void
}

export const SyncStateContext = React.createContext<{
  syncState: SyncState
  dispatch: (action: Action) => void
}>({
  syncState: {},
  dispatch: (action: Action) => {
    return
  },
})

export const SyncStore: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {}) as [
    SyncState,
    Dispatch<Action>
  ]
  const getState = useCallback(() => state, [state])

  const safeToDispatch = useRef(true)
  const wrappedDispatch = useCallback(
    (action: Action) => {
      if (!safeToDispatch.current) {
        return
      }
      CollectionEffects(dispatch)(action)
      return dispatch(action)
    },
    [dispatch]
  )

  useEffect(() => {
    safeToDispatch.current = true
    collectionManager.listen({ dispatch: wrappedDispatch, getState })

    const messageHandler = (msg: string) => {
      // receive actions that are broadcast from other tabs and send them to
      // the store, too
      const { payload } = JSON.parse(msg)
      if (
        payload.broadcast &&
        payload.sessionID &&
        payload.sessionID !== sessionId
      ) {
        wrappedDispatch(payload)
      }
    }

    channels.syncState.addEventListener('message', messageHandler)

    return () => {
      safeToDispatch.current = false
      collectionManager.unlisten()
      channels.syncState.removeEventListener('message', messageHandler)
    }
  }, [getState, wrappedDispatch])

  return (
    <SyncStateContext.Provider
      value={{ syncState: state, dispatch: wrappedDispatch }}
    >
      {children}
    </SyncStateContext.Provider>
  )
}

export const useSyncState = (): SyncState => {
  const { syncState } = useContext(SyncStateContext)
  if (!syncState) {
    throw new Error('Using SyncState outside of its context')
  }
  return syncState
}
