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

import { saveWithDebounce } from '../postgres-data/savingUtilities'
import * as docApi from './api/document'
import { AppliedStepsResponse, StepsPayload, StepsSinceResponse } from './types'

export interface ThrottlingControl {
  (currentlyThrottling: boolean, onUnload?: () => void): void
}

class QuarterbackStepsExchanger extends CollabProvider {
  private applySteps: (
    projectId: string,
    docId: string,
    payload: StepsPayload
  ) => Promise<AppliedStepsResponse | undefined>
  // @ts-ignore
  private docId: string
  // @ts-ignore
  private projectId: string

  private flushImmediate?: () => void

  getStepsSince: (
    projectId: string,
    docId: string,
    version: number
  ) => Promise<StepsSinceResponse | undefined>

  throttlingControl: ThrottlingControl

  debounce: ReturnType<typeof saveWithDebounce>

  throttleState: boolean

  constructor(
    docId: string,
    projectId: string,
    startingVersion: number,
    applySteps: QuarterbackStepsExchanger['applySteps'],
    getStepsSince: QuarterbackStepsExchanger['getStepsSince'],
    listenToSteps: (
      projectId: string,
      docId: string,
      listener: (version: number, steps: unknown[], clientIDs: number[]) => void
    ) => void,
    authToken: string,
    throttlingControl: ThrottlingControl
  ) {
    super()
    this.applySteps = applySteps
    this.docId = docId
    this.projectId = projectId

    this.throttlingControl = throttlingControl

    this.currentVersion = startingVersion
    this.debounce = saveWithDebounce()
    this.getStepsSince = getStepsSince

    this.sendSteps = this.sendSteps.bind(this)
    this.throttlingControl(false, this.flushOnExit.bind(this))

    listenToSteps(projectId, docId, (version, jsonSteps, clientIDs) => {
      if (!jsonSteps) {
        return
      }
      const steps = this.hydrateSteps(jsonSteps)
      if (steps.length) {
        this.currentVersion = version
        this.newStepsListener(version, steps, clientIDs)
      }
    })
  }

  hydrateSteps(jsonSteps: unknown[]) {
    return jsonSteps.map((s: unknown) => Step.fromJSON(schema, s)) as Step[]
  }

  async sendSteps(
    version: number,
    steps: Step[],
    clientID: string,
    flush = false
  ) {
    // Apply and accumulate new steps
    const stepsJSON: unknown[] = []
    steps.forEach((step) => {
      stepsJSON.push(step.toJSON())
    })

    this.flushImmediate = this.debounce(
      () => {
        this.applySteps(this.projectId, this.docId, {
          steps: stepsJSON,
          version,
          clientID,
        })
      },
      1000,
      flush,
      () => {
        this.throttlingControl(false)
      }
    )
    if (!flush) {
      this.throttlingControl(true)
    }

    return Promise.resolve()
  }

  flushOnExit() {
    this.flushImmediate && this.flushImmediate()
  }

  onNewSteps(listener: CollabProvider['newStepsListener']) {
    this.newStepsListener = listener
  }

  async stepsSince(version: number) {
    // retrieve the steps since the number of version given
    const res = await this.getStepsSince(this.projectId, this.docId, version)
    if (res) {
      return {
        steps: this.hydrateSteps(res.steps),
        clientIDs: res.clientIDs,
        version: res.version,
      }
    }
    return
  }
}

export const stepsExchanger = (
  docId: string,
  projectId: string,
  lastVersion: number,
  authToken: string,
  throttlingControl: ThrottlingControl,
  isAuthed = true
) => {
  if (!isAuthed) {
    return
  }
  const applySteps = async (
    projectId: string,
    docId: string,
    payload: StepsPayload
  ) => {
    const resp = await docApi.applySteps(projectId, docId, authToken, payload)
    if ('data' in resp) {
      return resp.data
    }
  }

  const getStepsSince = async (
    projectId: string,
    docId: string,
    version: number
  ) => {
    const resp = await docApi.stepsSince(projectId, docId, version, authToken)
    if ('data' in resp) {
      return resp.data
    }
  }

  return new QuarterbackStepsExchanger(
    docId,
    projectId,
    lastVersion,
    applySteps,
    getStepsSince,
    docApi.listenStepUpdates,
    authToken,
    throttlingControl
  )
}
export default QuarterbackStepsExchanger
