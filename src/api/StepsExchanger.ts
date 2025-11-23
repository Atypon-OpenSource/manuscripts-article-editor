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
import { CollabProvider } from '@manuscripts/body-editor'
import { schema } from '@manuscripts/transform'
import { Step } from 'prosemirror-transform'

import { Api } from './Api'
import { saveWithDebounce } from './savingUtilities'

const MAX_ATTEMPTS = 10
const THROTTLING_INTERVAL = 1200
const REQUEST_TIMEOUT_MS = 10000

export type Subscription<T> = (value: T) => void
export type SaveStatus = 'saving' | 'saved' | 'offline' | 'failed' | 'idle'

export class ObservableString {
  value: SaveStatus = 'idle'

  private sub: Subscription<SaveStatus> | undefined = undefined
  private savingTimeout: ReturnType<typeof setTimeout> | undefined = undefined

  setValue(value: SaveStatus) {
    if (this.value !== value) {
      this.value = value
      this.sub?.(value)

      if (this.savingTimeout) {
        clearTimeout(this.savingTimeout)
        this.savingTimeout = undefined
      }

      if (value === 'saving') {
        this.savingTimeout = setTimeout(() => {
          if (this.value === 'saving') {
            this.value = 'idle'
            this.sub?.('idle')
          }
          this.savingTimeout = undefined
        }, 3000)
      }
    }
  }

  onChange(sub: Subscription<SaveStatus>) {
    this.sub = sub
  }
}

export class ObservableBoolean {
  value = false

  private sub: Subscription<boolean> | undefined = undefined

  setValue(value: boolean) {
    this.value = value
    this.sub?.(value)
  }

  onChange(sub: Subscription<boolean>) {
    this.sub = sub
  }
}

export class StepsExchanger extends CollabProvider {
  projectID: string
  manuscriptID: string
  api: Api
  debounce: ReturnType<typeof saveWithDebounce>
  flushImmediately?: () => void
  updateStoreVersion: (version: number) => void
  closeConnection: () => void
  isThrottling: ObservableBoolean
  saveStatus: ObservableString
  attempt = 0

  constructor(
    projectID: string,
    manuscriptID: string,
    currentVersion: number,
    api: Api,
    updateStoreVersion: (version: number) => void
  ) {
    super()

    this.projectID = projectID
    this.manuscriptID = manuscriptID
    this.currentVersion = currentVersion
    this.isThrottling = new ObservableBoolean()
    this.saveStatus = new ObservableString()
    this.debounce = saveWithDebounce()
    this.api = api
    this.updateStoreVersion = updateStoreVersion

    if (!navigator.onLine) {
      this.saveStatus.setValue('offline')
    } else {
      this.start()
    }

    this.addNetworkListeners()
    this.stop = this.stop.bind(this)
  }

  private addNetworkListeners() {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  private removeNetworkListeners() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }

  private handleOnline = () => {
    console.log('Connection recovered. Going back online.')
    this.saveStatus.setValue('idle')
    this.start()
  }

  private handleOffline = () => {
    console.log('Connection lost. Going offline.')
    this.saveStatus.setValue('offline')
    this.closeConnection()
  }

  async sendSteps(
    version: number,
    steps: Step[],
    clientID: string,
    flush = false
  ) {

    this.flushImmediately = this.debounce(
      async () => {
        this.saveStatus.setValue('saving')

        const timeoutPromise = new Promise<{ error: string }>((resolve) => {
          setTimeout(() => {
            resolve({ error: 'timeout' })
          }, REQUEST_TIMEOUT_MS)
        })

        const response = await Promise.race([
          this.api.sendSteps(this.projectID, this.manuscriptID, {
            steps: steps,
            version,
            clientID,
          }),
          timeoutPromise,
        ])

        if (response.error === 'timeout') {
          this.saveStatus.setValue(navigator.onLine ? 'failed' : 'offline')
          this.attempt = 0
        } else if (response.error === 'conflict') {
          if (this.attempt < MAX_ATTEMPTS) {
            this.newStepsListener()
            this.attempt++
          } else {
            this.saveStatus.setValue('failed')
            this.attempt = 0
          }
        } else if (response.error) {
          console.error('Failed to send steps', response.error)
          this.saveStatus.setValue('failed')
          this.attempt = 0
        } else {
          this.saveStatus.setValue('saved')
          this.attempt = 0
        }
      },
      THROTTLING_INTERVAL,
      flush,
      () => this.isThrottling.setValue(false)
    )

    if (!flush) {
      this.isThrottling.setValue(true)
    }

    return Promise.resolve()
  }

  async receiveSteps(version: number, steps: unknown[], clientIDs: number[]) {
    this.currentVersion = version
    this.updateStoreVersion(version)

    if (steps.length) {
      //TODO send steps to listener
      this.newStepsListener()
    }
  }

  start() {
    if (navigator.onLine) {
      this.closeConnection = this.api.listenToSteps(
        this.projectID,
        this.manuscriptID,
        (version, steps, clientIDs) =>
          this.receiveSteps(version, steps, clientIDs)
      )
    } else {
      this.closeConnection = () => {}
    }
  }

  stop() {
    this.closeConnection()
    this.removeNetworkListeners()
  }

  flush() {
    this.flushImmediately && this.flushImmediately()
  }

  onNewSteps(listener: CollabProvider['newStepsListener']) {
    this.newStepsListener = listener
  }

  async stepsSince(version: number) {
    if (this.saveStatus.value === 'offline') {
      return
    }

    const response = await this.api.getStepsSince(
      this.projectID,
      this.manuscriptID,
      version
    )

    if (response) {
      return {
        steps: response.steps.map((s) => Step.fromJSON(schema, s)),
        clientIDs: response.clientIDs,
        version: response.version,
      }
    }
  }
}
