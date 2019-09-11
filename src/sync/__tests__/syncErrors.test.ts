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

import reducer from '../syncErrors'

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
    const finalState = reducer(undefined, {
      type: 'event',
      event,
    })
    expect(finalState).toHaveLength(1)
  })

  it('should clear sync errors', () => {
    const event1: any = {
      type: 'error',
      detail: {
        direction: 'push',
        collection: 'col',
        error: new Error(),
      },
    }
    const initialState: any = reducer(undefined, {
      type: 'event',
      event: event1,
    })
    const event2: any = {
      type: 'complete',
      detail: {
        direction: 'push',
        collection: 'col',
      },
    }
    const finalState = reducer(initialState, {
      type: 'event',
      event: event2,
    })
    expect(finalState).toHaveLength(0)
  })

  it('should only keep the latest sync error per collection/direction', () => {
    const event1: any = {
      type: 'error',
      detail: {
        direction: 'push',
        collection: 'col',
        error: new Error('First Error'),
      },
    }
    const initialState: any = reducer(undefined, {
      type: 'event',
      event: event1,
    })
    const event2: any = {
      type: 'error',
      detail: {
        direction: 'push',
        collection: 'col',
        error: new Error('Second Error'),
      },
    }
    const finalState = reducer(initialState, {
      type: 'event',
      event: event2,
    })
    expect(finalState).toHaveLength(1)
  })
})
