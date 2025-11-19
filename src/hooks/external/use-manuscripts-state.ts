/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import isEqual from '../../lib/deeper-equal'
import { state } from '../../store'

/**
 * These hooks are not used within the editor, but exposed to the parent app
 * to allow it to observe the state of the editor.
 */

export type ManuscriptsState = {
  get: () => state | undefined
  update: (state: Partial<state>) => void
}

export type ManuscriptsStateRef = MutableRefObject<ManuscriptsState | undefined>

export type ManuscriptsStateSubscription = (state: state) => void

export type ManuscriptsStateObserver = {
  state: ManuscriptsStateRef
  onUpdate: (state: state) => void
  subscribe: (sub: ManuscriptsStateSubscription) => void
  unsubscribe: (sub: ManuscriptsStateSubscription) => void
}

export const ManuscriptsStateObserverContext = createContext<
  ManuscriptsStateObserver | undefined
>(undefined)

export const useManuscriptsStateObserver = () => {
  const stateRef = useRef<ManuscriptsState>(undefined)
  return useMemo(() => newObserver(stateRef), [])
}

/**
 * Get the value of the state of the editor.
 * The selector param is memoized and the flush param is used to force reevaluation.
 */
export const useManuscriptsState = <T>(
  selector: (s: state) => T,
  flush = false
) => {
  const [value, setValue] = useState<T>()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  selector = useCallback(selector, [flush])
  const observer = useContext(ManuscriptsStateObserverContext)
  useEffect(() => {
    if (!observer) {
      return
    }
    const sub = (state: state) => {
      if (state) {
        const $new = selector(state)
        setValue((old) => (isEqual(old, $new) ? old : $new))
      }
    }
    observer.subscribe(sub)
    return () => {
      observer.unsubscribe(sub)
    }
  }, [observer, selector])
  return [value]
}

const newObserver = (
  stateRef: ManuscriptsStateRef
): ManuscriptsStateObserver => {
  const subs: Set<ManuscriptsStateSubscription> = new Set()
  const subscribe = (sub: ManuscriptsStateSubscription) => {
    subs.add(sub)
  }
  const unsubscribe = (sub: ManuscriptsStateSubscription) => {
    subs.delete(sub)
  }
  const onUpdate = (state: state) => {
    subs.forEach((sub) => sub(state))
  }
  return {
    state: stateRef,
    onUpdate,
    subscribe,
    unsubscribe,
  }
}
