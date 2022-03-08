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

import { dispatch, state } from './Store'
import { useGenericStore } from './StoreContext'
// import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

const deeperEqual = (prev: any, next: any) => {
  // checking only one level deeper is enough to provide render relevenat equality
  if (!prev) {
    return false
  }
  switch (prev.constructor.name) {
    case 'Object':
      // if (next.constructor.name === 'Object') {
      // }
      return prev === next // @TODO implement better check maybe
    case 'Map': // important for modelMap
      if (prev == next && prev.size == next.size) {
        for (const [key, value] of prev) {
          const nextPeer = next.get(key)
          if (!nextPeer || nextPeer !== value) {
            return false
          }
        }
        return true
      }
      return false
    case 'Array':
      if (Array.isArray(next)) {
        if (prev.length !== next.length) {
          return false
        }
        for (let i = 0; i < prev.length; i++) {
          if (prev[i] !== next[i]) {
            return false
          }
        }

        return true
      }
      return false
    default:
      return prev === next
  }
}

export const useStore = <T>(
  selector = (r: state): state | T => r
): [T, dispatch] => {
  const store = useGenericStore()
  const [state, setState] = useState(
    selector ? () => selector(store.state!) : store.state
  )

  // @TODO - in react 18 these hooks usage will have to be replaced with this to work correctly with the concurrent rendering
  //   const state = useSyncExternalStoreWithSelector(
  //     store.subscribe,
  //     store.getState(),
  //     undefined,
  //     selector,
  //     deeperEqual
  //   );

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe((newStoreState: state) => {
      if (selector) {
        const selectedState = selector(newStoreState)
        if (!deeperEqual(selectedState, state)) {
          // @TODO if object or array
          setState(selectedState)
        }
      } else {
        setState(newStoreState)
      }
    })
    return () => unsubscribe && unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // @TODO reconsider disabling exhaustive-deps
  // @ts-ignore
  return [state, store.dispatchAction]
}
