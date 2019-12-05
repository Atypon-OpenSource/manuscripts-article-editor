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

import reducer, {
  getInitialState,
  getPushSyncErrorMessage,
} from '../syncErrors'

/* tslint:disable:no-any */
describe('syncErrors reducer', () => {
  it('should track sync errors', () => {
    const event: any = {
      type: 'error',
      detail: {
        direction: 'push',
        collection: 'col',
        error: new Error(),
      },
    }
    const finalState = reducer(getInitialState(), {
      type: 'event',
      event,
    })
    expect(finalState.allEvents).toHaveLength(1)
    expect(finalState.newEvents).toHaveLength(1)
  })

  it('should ignore events while offline', () => {
    const event: any = {
      type: 'error',
      detail: {
        direction: 'push',
        collection: 'col',
        error: new Error(),
      },
    }
    const finalState = reducer(getInitialState(), {
      type: 'event',
      isOffline: true,
      event,
    })
    expect(finalState.allEvents).toHaveLength(0)
    expect(finalState.newEvents).toHaveLength(0)
  })

  it('should reset by clearing new events but keeping all events', () => {
    const event: any = {
      type: 'error',
      detail: {
        direction: 'push',
        collection: 'col',
        error: new Error(),
      },
    }
    const initialState = reducer(getInitialState(), {
      type: 'event',
      event,
    })
    const finalState = reducer(initialState, {
      type: 'reset',
    })
    expect(finalState.allEvents).toHaveLength(1)
    expect(finalState.newEvents).toHaveLength(0)
  })
})

describe('getPushSyncErrorMessage', () => {
  it('should show an error message dependent on the status code', () => {
    const event: any = {
      error: {
        status: 409,
      },
    }
    const message = getPushSyncErrorMessage(event)
    expect(message).toEqual(
      'Syncing your changes failed due to a data conflict.'
    )
  })
})
