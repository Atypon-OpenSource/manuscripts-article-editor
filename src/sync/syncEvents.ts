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

import { AxiosError } from 'axios'
import { get } from 'lodash-es'

import sessionId from '../lib/session-id'
import { buildCollectionName } from './Collection'
import {
  Action,
  CollectionMeta,
  CollectionState,
  ErrorEvent,
  PouchReplicationError,
  SyncState,
} from './types'

export enum CONSTANTS {
  INIT = 'INIT',
  OPEN = 'OPEN',
  COMPLETE = 'COMPLETE',
  PULL_FAILED = 'PULL_FAILED',
  ERROR = 'ERROR',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCEL = 'CANCEL',
  RESET_ERRORS = 'RESET_ERRORS',
  CLOSE = 'CLOSE',
}
const c = CONSTANTS

const blankCollection = (
  meta: CollectionMeta
): { meta: CollectionMeta; state: CollectionState } => ({
  meta,
  state: {
    firstPullComplete: false,
    push: null,
    pull: null,
    backupPullComplete: false,
    backupPush: null,
    errors: [],
    errorDocIds: [],
    closed: false,
  },
})

export const actions = {
  open: (collectionName: string, meta: CollectionMeta): Action => {
    return {
      type: c.OPEN,
      collectionName,
      payload: {
        meta,
      },
    }
  },

  replicationComplete: (
    collectionName: string,
    direction: 'push' | 'pull'
  ): Action => {
    return {
      type: c.COMPLETE,
      collectionName,
      payload: {
        direction,
      },
    }
  },

  initialPullFailed: (collectionName: string): Action => {
    return {
      type: c.PULL_FAILED,
      collectionName,
      payload: {},
    }
  },

  writeError: (
    collectionName: string,
    operation: string,
    error: Error
  ): Action => {
    return {
      type: c.ERROR,
      collectionName,
      payload: {
        operation,
        error,
        timestamp: Date.now() / 1000,
      },
    }
  },

  active: (
    collectionName: string,
    direction: 'push' | 'pull',
    active: boolean
  ): Action => {
    if (active) {
      return {
        type: c.ACTIVE,
        collectionName,
        payload: {
          direction,
        },
      }
    }
    return {
      type: c.INACTIVE,
      collectionName,
      payload: {
        direction,
      },
    }
  },

  cancel: (collectionName: string) => {
    return {
      type: c.CANCEL,
      collectionName,
      payload: {},
    }
  },

  syncError: (
    collectionName: string,
    direction: 'push' | 'pull' | 'unknown',
    error: AxiosError | PouchReplicationError | Error
  ): Action => {
    return {
      type: c.ERROR,
      collectionName,
      payload: {
        direction,
        error,
        timestamp: Date.now() / 1000,
      },
    }
  },

  resetErrors: (): Action => {
    return {
      type: c.RESET_ERRORS,
      collectionName: 'all',
      payload: {},
    }
  },

  close: (collectionName: string, success: boolean) => {
    return {
      type: c.CLOSE,
      collectionName,
      payload: {
        success,
        // broadcast to other tabs IF this is now a zombie
        broadcast: true,
        sessionId,
      },
    }
  },
}

const StateData = <T>(key: keyof CollectionState, defaultVal: T) => (
  collectionName: string,
  state: SyncState
) => {
  return get(
    state,
    `${buildCollectionName(collectionName)}.state.${key}`,
    defaultVal
  )
}

export const selectors = {
  isInitialPullComplete: StateData<boolean>('firstPullComplete', false),

  hasPullError: (collectionName: string, state: SyncState) => {
    const firstPullComplete = StateData<boolean | 'error'>(
      'firstPullComplete',
      false
    )(collectionName, state)
    return firstPullComplete === 'error'
  },

  allErrors: (state: SyncState) => {
    return Object.keys(state).reduce(
      (collectedErrors, collectionName) =>
        collectedErrors.concat(state[collectionName].state.errors),
      [] as ErrorEvent[]
    )
  },

  errorReport: (state: SyncState) => {
    return selectors
      .allErrors(state)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((event) => ({
        error: event.error,
        timestamp: event.timestamp,
        direction: event.direction,
        operation: event.operation,
        collectionName: event.collectionName,
      }))
  },

  // SELECTORS TO IMPLEMENT
  newErrors: (state: SyncState) => {
    return selectors
      .allErrors(state)
      .filter((error) => !error.ack)
      .sort((a, b) => a.timestamp - b.timestamp)
  },

  oneZombie: (state: SyncState) => {
    return Object.keys(state).find(
      (collection) => state[collection].state.closed === 'zombie'
    )
  },

  notClosed: (state: SyncState) => {
    return Object.keys(state).filter(
      (collection) => state[collection].state.closed !== true
    )
  },
}

const updateCollection = (
  collectionName: string,
  initialState: SyncState,
  updates: Partial<CollectionState>
): SyncState => {
  return {
    ...initialState,
    [collectionName]: {
      meta: initialState[collectionName].meta,
      state: {
        ...initialState[collectionName].state,
        ...updates,
      },
    },
  }
}

const appendError = (
  collectionName: string,
  initialState: SyncState,
  error: ErrorEvent
) => {
  const nextErrors = [...initialState[collectionName].state.errors, error]
  return updateCollection(collectionName, initialState, {
    errors: nextErrors,
  })
}

/* tslint:disable:cyclomatic-complexity */
export default (state: SyncState, action?: Action): SyncState => {
  if (!action || !action.type || !action.collectionName) {
    return state
  }

  const { collectionName, type } = action

  if (!collectionName) {
    return state
  }

  if (type === c.OPEN) {
    return {
      ...state,
      [collectionName]: blankCollection(action.payload.meta as CollectionMeta),
    }
  }

  if (!state[collectionName] && collectionName !== 'all') {
    return state
  }

  switch (type) {
    case c.COMPLETE: {
      return updateCollection(
        collectionName,
        state,
        action.payload.direction === 'pull'
          ? {
              firstPullComplete: true,
              pull: 'ready',
            }
          : {
              push: 'ready',
            }
      )
    }

    case c.PULL_FAILED: {
      return updateCollection(collectionName, state, {
        firstPullComplete: 'error',
      })
    }

    case c.ACTIVE: {
      return updateCollection(
        collectionName,
        state,
        action.payload.direction === 'pull'
          ? { pull: 'active' }
          : { push: 'active' }
      )
    }

    case c.INACTIVE: {
      return updateCollection(
        collectionName,
        state,
        action.payload.direction === 'pull'
          ? { pull: 'ready' }
          : { push: 'ready' }
      )
    }

    case c.CANCEL: {
      return updateCollection(collectionName, state, {
        push: 'cancelled',
        pull: 'cancelled',
      })
    }

    case c.ERROR: {
      const event: ErrorEvent = {
        error: action.payload.error,
        direction: action.payload.direction,
        operation: action.payload.operation,
        timestamp: action.payload.timestamp,
        collectionName,
        ack: false,
      }
      return appendError(collectionName, state, event)
    }

    case c.RESET_ERRORS: {
      return Object.keys(state).reduce(
        (nextState, collectionName) =>
          updateCollection(collectionName, nextState, {
            errors: state[collectionName].state.errors.map((error) => ({
              ...error,
              ack: true,
            })),
          }),
        state
      )
    }

    case c.CLOSE: {
      return updateCollection(collectionName, state, {
        closed: action.payload.success ? true : 'zombie',
      })
    }
  }

  return state
}
