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
import {
  ICreateDocRequest,
  ICreateDocResponse,
  IGetDocumentResponse,
  IUpdateDocumentRequest,
} from '@manuscripts/quarterback-types'
import { Step } from 'prosemirror-transform'

import { del, get, listen, post, put } from './methods'

export type StepsPayload = {
  steps: unknown[]
  version: number
  clientID: number | string
}

export type AppliedStepsResponse = {
  lastVersion?: number
  steps?: number
  error?: string
}

export type StepWithClientID = Step & {
  clientID: string
}

export type StepsSinceResponse = {
  steps: StepWithClientID[]
  version: number
}

export const getDocument = (id: string) =>
  get<IGetDocumentResponse>(`doc/${id}`, 'Fetching document failed')

export const createDocument = (payload: ICreateDocRequest) =>
  post<ICreateDocResponse>('doc', payload, 'Creating document failed')

export const updateDocument = (id: string, payload: IUpdateDocumentRequest) =>
  put<boolean>(`doc/${id}`, payload, 'Updating document failed')

export const deleteDocument = (docId: string) =>
  del<boolean>(`doc/${docId}`, 'Deleting document failed')

export const applySteps = (docId: string, payload: StepsPayload) =>
  post<AppliedStepsResponse>(
    `doc/${docId}/steps`,
    payload,
    'Creating document failed'
  )

export const stepsSince = (docId: string, version: number) =>
  get<StepsSinceResponse>(
    `doc/${docId}/version/${version}`,
    'Fetching document failed'
  )

export const listenStepUpdates = (
  docId: string,
  dataListener: (version: string, steps: StepWithClientID[]) => void
) => {
  const listener = (event: MessageEvent) => {
    if (event.data) {
      const data = JSON.parse(event.data)
      if (data.version && data.steps && Array.isArray(data.steps)) {
        dataListener(data.version as string, data.steps as StepWithClientID[])
      }
    }
  }

  listen(`doc/${docId}/listen`, 'NEW_STEPS', listener)
}
