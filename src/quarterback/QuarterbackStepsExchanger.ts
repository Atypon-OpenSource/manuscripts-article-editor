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
import { Step } from 'prosemirror-transform'

import {
  AppliedStepsResponse,
  StepsPayload,
  StepsSinceResponse,
  StepWithClientID,
} from './api/document'

export abstract class StepsCollabProvider {
  currentVersion: number
  protected newStepsListener: (steps: Step[], clientIDs: string[]) => void
  abstract sendSteps(
    version: number,
    steps: readonly Step[],
    clientID: string | number
  ): Promise<void>
  abstract onNewSteps(listener: StepsCollabProvider['newStepsListener']): void
  abstract stepsSince(version: number): Promise<
    | {
        steps: Step[]
        clientIDs: string[]
        version: number
      }
    | undefined
  >
}

class QuarterbackStepsExchanger extends StepsCollabProvider {
  private applySteps: (
    docId: string,
    payload: StepsPayload
  ) => Promise<AppliedStepsResponse | undefined>
  private docId: string

  getStepsSince: (
    docId: string,
    version: number
  ) => Promise<StepsSinceResponse | undefined>

  constructor(
    docId: string,
    startingVersion: number,
    applySteps: QuarterbackStepsExchanger['applySteps'],
    getStepsSince: QuarterbackStepsExchanger['getStepsSince'],
    listenToSteps: (
      docId: string,
      listener: (version: string, stepsWithClientId: StepWithClientID[]) => void
    ) => void
  ) {
    super()
    this.applySteps = applySteps
    this.docId = docId

    this.currentVersion = startingVersion
    this.getStepsSince = getStepsSince

    this.sendSteps = this.sendSteps.bind(this)

    // listenToSteps(docId, (version, stepsWithClientId) => {
    //   const { steps, clientIDs } =
    //     this.breakdownStepsWithClientID(stepsWithClientId)
    //   this.newStepsListener(steps, clientIDs)
    // })
  }

  async sendSteps(version: number, steps: Step[], clientID: string) {
    // this is for the backend - basically a mark to check if version is applicable and do something about it if not
    //if (version !== this.previousVersion) return

    console.log('Steps')
    console.log(steps)
    // Apply and accumulate new steps
    const stepsJSON: unknown[] = []
    steps.forEach((step) => {
      stepsJSON.push(step.toJSON())

      //  backend has to make sure -> -> ->
      //  this.doc = step.apply(this.doc).doc
      //  this.steps.push(step)
      //  this.stepClientIDs.push(clientID)
    })

    this.currentVersion = version

    await this.applySteps(this.docId, {
      steps: stepsJSON,
      version,
      clientID,
    })
  }

  onNewSteps(listener: StepsCollabProvider['newStepsListener']) {
    this.newStepsListener = listener
  }

  breakdownStepsWithClientID(stepsWithClientId: StepWithClientID[]) {
    const clientIDs: string[] = []
    const steps: Step[] = []
    for (let i = 0; i < stepsWithClientId.length; i++) {
      const step = stepsWithClientId[i]
      const cleanStep: any = {}
      for (const key in step) {
        if (key == 'clientID') {
          continue
        }
        cleanStep[key] = step[key as keyof Step]
      }
      steps.push(cleanStep)
      clientIDs.push(step.clientID)
    }

    return { steps, clientIDs }
  }

  async stepsSince(version: number) {
    // retrieve the steps since the number of version given
    const res = await this.getStepsSince(this.docId, version)
    if (res) {
      const { steps, clientIDs } = this.breakdownStepsWithClientID(res.steps)
      return { steps, clientIDs, version: res.version }
    }
    return
  }
}

export default QuarterbackStepsExchanger
