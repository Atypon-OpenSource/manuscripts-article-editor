/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */

import { state } from './Store'

export type IObserver = (state: { [key: string]: unknown }) => void

export interface ISubject {
  onUpdate(observer: IObserver): void
  update(state: unknown): void
  detach(): void
  storeObserver: (state: state) => void
  onStoreInternalUpdate: (fn: (state: state) => void) => void
}

export class ParentObserver implements ISubject {
  private observer: IObserver | undefined = undefined
  private storeListener: ((state: state) => void) | undefined

  onUpdate = (observer: IObserver) => {
    this.observer = observer
  }

  update = (partialState: { [key: string]: unknown }) => {
    if (this.observer) {
      this.observer(partialState)
    }
  }

  storeObserver = (state: state) => {
    this.storeListener && this.storeListener(state) // storeListener shoudldn't be directly assigned to storeObserver to avoid potential order of execution problems
  }

  onStoreInternalUpdate = (fn: (state: state) => void) => {
    // it's supposed to be listened by the parent so there is only a single listener
    this.storeListener = fn
  }

  detach = () => {
    this.storeListener = undefined
    this.observer = undefined
  }
}
