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

import { StepsPayload } from './api/document'

abstract class StepsCollabProvider {
  steps: Step[]
  currentVersion: number
  stepClientIDs: number[]
  sendSteps: (version: number, steps: Step[], clientID: string) => void
}

type AuthorityResponse = {
  lastVersion?: number
  steps?: number
  status: 'reconcile' | 'ok' | 'error'
  error?: string
}

class QuarterbackProvider extends StepsCollabProvider {
  private applySteps: (
    docId: string,
    payload: StepsPayload
  ) => AuthorityResponse
  private docId: string

  constructor(
    docId: string,
    startingVersion: number,
    applySteps: (docId: string, payload: StepsPayload) => AuthorityResponse
  ) {
    super()
    this.applySteps = applySteps
    this.docId = docId
    // this.doc = doc
    this.steps = []
    this.stepClientIDs = []
    this.currentVersion = startingVersion

    this.sendSteps = this.sendSteps.bind(this)
  }

  sendSteps(version: number, steps: Step[], clientID: string) {
    // this is for the backend - basically a mark to check if version si applicable and do something about it if not
    //if (version !== this.previousVersion) return

    // Apply and accumulate new steps
    const stepsJSON: unknown[] = []
    steps.forEach((step) => {
      stepsJSON.push(step.toJSON())
      // backend has to make sure

      //   this.doc = step.apply(this.doc).doc
      //   this.steps.push(step)
      //   this.stepClientIDs.push(clientID)
    })

    this.applySteps(this.docId, {
      steps: stepsJSON,
      version: this.currentVersion,
    })

    // Signal listeners
    // this.onNewSteps.forEach(function (f) {
    //   f()
    // })
  }

  //   stepsSince(version) {
  //     return {
  //       steps: this.steps.slice(version),
  //       clientIDs: this.stepClientIDs.slice(version),
  //     }
  //   }
}

export default QuarterbackProvider
