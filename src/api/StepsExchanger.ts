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

export type Subscription = (value: boolean) => void

export class ObservableBoolean {
  value = false
  private subs: Subscription[] = []

  setValue(value: boolean) {
    this.value = value
    this.subs.forEach((s) => s(value))
  }

  onChange(sub: Subscription) {
    this.subs.push(sub)
  }
}

/**
 * Utility function to check if the Step is related to a comment.
 */
const hasCommentStep = (steps: Step[]): boolean => {
  return steps.some((step) => {
    // Only 'replace' steps carry a slice/content that might contain a new node.
    if (step.toJSON().stepType === 'replace') {
      const slice = (step.toJSON() as any).slice
      if (slice && slice.content) {
        // Look through the inserted content for a node of type 'comment'.
        return slice.content.some(
          (contentNode: any) => contentNode.type === 'comment'
        )
      }
    }
    return false
  })
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
    const isCommentStep = hasCommentStep(steps)
    // If a comment step is detected and it's NOT an explicit flush (i.e., auto-save attempt),
    // we immediately return without queuing the save.
    if (isCommentStep && !flush) {
      return Promise.resolve()
    }
    // ------------------------

    this.flushImmediately = this.debounce(
      async () => {
        const response = await this.api.sendSteps(
          this.projectID,
          this.manuscriptID,
          {
            steps: steps,
            version,
            clientID,
          }
        )
        if (response.error === 'conflict' && this.attempt < MAX_ATTEMPTS) {
          console.warn('Retrying')
          this.newStepsListener()
          this.attempt++
        } else if (response.error) {
          console.error('Failed to send steps', response.error)
        } else {
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
