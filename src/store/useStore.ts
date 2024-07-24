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
import { useLayoutEffect, useState } from 'react'

import deeperEqual from '../lib/deeper-equal'
import { dispatch, GenericStore, state } from './Store'
import { useGenericStore } from './StoreContext'
// import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
type Selector<T> = (r: state) => state | T
export const useStore = <T>(
  selector?: Selector<T>
): [T, dispatch, () => state, GenericStore['subscribe']] => {
  const store = useGenericStore()
  const init = selector ? () => selector(store.state!) : store.state
  const [state, setState] = useState(init)

  // @TODO - in react 18 these hooks usage will have to be replaced with this to work correctly with the concurrent rendering
  //   const state = useSyncExternalStoreWithSelector(
  //     store.subscribe,
  //     store.getState(),
  //     undefined,
  //     selector,
  //     deeperEqual
  //   );

  useLayoutEffect(() => {
    if (!selector) {
      return
    }
    const unsubscribe = store.subscribe((newStoreState: state) => {
      setState((currentState) => {
        const newState = selector(newStoreState)
        if (!deeperEqual(newState, currentState)) {
          return newState
        }
        return currentState
      })
    })
    return () => unsubscribe && unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // @ts-ignore
  return [state, store.dispatchAction, store.getState, store.subscribe]
}

// Allows to get store's state on demand rather than subscribing to it
export const useGetState = () => {
  const store = useGenericStore()
  return store.getState
}
