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

export type action = { action: string; payload: any }
export type state = { [key: string]: any }
export type reducer = (_: string, payload: any, store: state) => state

const defaultReducer = (_: string, payload: any, store: state) => {
  return { ...store, ...payload }
}

export interface Store {
  state: state
  dispatchAction(action: action): void
  reducer(
    action: string,
    payload: any,
    store: { [key: string]: any }
  ): { [key: string]: any }
  beforeAction?(action: string, payload: any, store: state): void | action
  unmountHandler?(state: state): void
  subscribe(fn: () => void): () => void
  queue: Set<(state: state) => void>
  onUnmount(): void
}

export class GenericStore implements Store {
  reducer
  beforeAction
  unmountHandler
  state
  constructor(
    state = {},
    reducer = defaultReducer,
    beforeAction?: (
      action: string,
      payload: any,
      store: state
    ) => void | action,
    unmountHandler?: (state: state) => void
  ) {
    this.reducer = reducer
    this.state = state
    if (beforeAction) {
      this.beforeAction = beforeAction
    }
    if (unmountHandler) {
      this.unmountHandler = unmountHandler
    }
    this.dispatchQueue = this.dispatchQueue.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.dispatchAction = this.dispatchAction.bind(this)
    this.setState = this.setState.bind(this)
    this.getState = this.getState.bind(this)
  }
  queue: Set<(state: state) => void> = new Set()
  getState() {
    return this.state
  }
  setState(state: state) {
    this.state = state
    this.dispatchQueue()
  }
  dispatchQueue() {
    this.queue.forEach((fn) => fn(this.state))
  }
  subscribe(fn: () => void) {
    const queue = this.queue
    queue.add(fn)
    return function unsubscribe() {
      queue.delete(fn)
    }
  }
  dispatchAction({ action, payload }: action) {
    if (this.beforeAction) {
      const beforeActionFilter = this.beforeAction(action, payload, this.state)
      if (beforeActionFilter) {
        this.setState(
          this.reducer(
            beforeActionFilter.action,
            beforeActionFilter.payload,
            this.state
          )
        )
      }
    } else {
      this.setState(this.reducer(action, payload, this.state))
    }
  }
  onUnmount() {
    if (this.unmountHandler) {
      this.unmountHandler(this.state)
    }
    this.queue = new Set()
  }
}
