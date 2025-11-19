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

const MAX_ATTEMPTS = 20
const THROTTLING_INTERVAL = 1200

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

      // Clear any existing timeout
      if (this.savingTimeout) {
        clearTimeout(this.savingTimeout)
        this.savingTimeout = undefined
      }

      // If status is 'saving', set a timeout to clear it after 3 seconds to prevent getting stuck
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
    this.start()
    this.updateStoreVersion = updateStoreVersion
    this.stop = this.stop.bind(this)
  }

  async sendSteps(
    version: number,
    steps: Step[],
    clientID: string,
    flush = false
  ) {
    if (steps.length === 0) {
      return Promise.resolve()
    }

    this.flushImmediately = this.debounce(
      async () => {
        this.saveStatus.setValue('saving')

        const response = await this.api.sendSteps(
          this.projectID,
          this.manuscriptID,
          {
            steps: steps,
            version,
            clientID,
          }
        )

        if (response.error === 'conflict') {
          if (this.attempt < MAX_ATTEMPTS) {
            // Conflict, retry is possible (attempt 0 to 19)
            this.newStepsListener()
            this.attempt++
          } else {
            // Conflict, max attempts reached (attempt 20). Treat as failure and show error icon.
            this.saveStatus.setValue('failed')
            this.attempt = 0 // Reset attempt counter
          }
        } else if (response.error) {
          console.error('Failed to send steps', response.error)
          this.saveStatus.setValue('failed')
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
    this.closeConnection = this.api.listenToSteps(
      this.projectID,
      this.manuscriptID,
      (version, steps, clientIDs) =>
        this.receiveSteps(version, steps, clientIDs)
    )
  }

  stop() {
    this.closeConnection()
  }

  flush() {
    this.flushImmediately && this.flushImmediately()
  }

  onNewSteps(listener: CollabProvider['newStepsListener']) {
    this.newStepsListener = listener
  }

  async stepsSince(version: number) {
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
