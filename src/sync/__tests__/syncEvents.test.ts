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

import deepFreeze from 'deep-freeze'

import reducer, { actions, selectors } from '../syncEvents'
import { Action, SyncState } from '../types'

const run = (state: SyncState, ...actions: Action[]) => {
  const next = actions.reduce((state, action) => {
    return reducer(state, action)
  }, state)
  deepFreeze(next)
  return next
}

const meta = {
  isProject: false,
  remoteUrl: '',
  backupUrl: '',
  channels: [],
}

const baseState = () => {
  const state = run({}, actions.open('my_collection', meta))
  return state
}

describe('reducer', () => {
  test('opening collections', () => {
    const init = baseState()
    expect(selectors.isInitialPullComplete('my_collection', init)).toEqual(
      false
    )
    const final = run(
      init,
      actions.replicationComplete('my_collection', 'pull')
    )
    expect(selectors.isInitialPullComplete('my_collection', final)).toEqual(
      true
    )
  })

  test('adding errors', () => {
    const init = run(baseState(), actions.open('collection_2', meta))
    expect(selectors.newErrors(init)).toHaveLength(0)
    expect(selectors.errorReport(init)).toHaveLength(0)

    const withErrors = run(
      init,
      actions.syncError('my_collection', 'push', new Error()),
      actions.syncError('collection_2', 'push', new Error())
    )
    expect(selectors.newErrors(withErrors)).toHaveLength(2)
    expect(selectors.errorReport(withErrors)).toHaveLength(2)

    const errorReset = run(withErrors, actions.resetErrors())
    expect(selectors.newErrors(errorReset)).toHaveLength(0)
    expect(selectors.errorReport(errorReset)).toHaveLength(2)
  })

  test('closing collections', () => {
    const init = run(baseState(), actions.open('collection_2', meta))
    expect(selectors.notClosed(init)).toHaveLength(2)
    expect(selectors.oneZombie(init)).toBeFalsy()

    const oneClosed = run(init, actions.close('collection_2', true))
    expect(selectors.notClosed(oneClosed)).toHaveLength(1)
    expect(selectors.oneZombie(oneClosed)).toBeFalsy()

    const withZombie = run(oneClosed, actions.close('my_collection', false))
    expect(selectors.notClosed(withZombie)).toHaveLength(1)
    expect(selectors.oneZombie(withZombie)).toEqual('my_collection')
  })
})
