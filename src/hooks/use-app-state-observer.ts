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

import { createContext, MutableRefObject, useMemo, useRef } from 'react'

import { state } from '../store'

export type Subscription = (state: state) => void

export type AppState = {
  get: () => state | undefined
  update: (state: Partial<state>) => void
}

export type AppStateRef = MutableRefObject<AppState | undefined>

export type AppStateObserver = {
  state: AppStateRef
  onUpdate: (state: state) => void
  subscribe: (sub: Subscription) => void
  unsubscribe: (sub: Subscription) => void
}

const newObserver = (stateRef: AppStateRef): AppStateObserver => {
  const subs: Set<Subscription> = new Set()
  const subscribe = (sub: Subscription) => {
    subs.add(sub)
  }
  const unsubscribe = (sub: Subscription) => {
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

export const AppStateObserverContext = createContext<
  AppStateObserver | undefined
>(undefined)

export const useAppStateObserver = () => {
  const stateRef = useRef<AppState>()
  return useMemo(() => newObserver(stateRef), [])
}
