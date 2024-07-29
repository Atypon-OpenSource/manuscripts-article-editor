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
  AppliedStepsResponse,
  ICreateDocRequest,
  IUpdateDocumentRequest,
  ManuscriptDocWithSnapshots,
  StepsPayload,
  StepsSinceResponse,
  TransformerVersion,
} from '../types'
import { del, get, listen, post, put } from './methods'

export const getDocument = (
  projectID: string,
  manuscriptID: string,
  authToken: string
) =>
  get<ManuscriptDocWithSnapshots>(
    `doc/${projectID}/manuscript/${manuscriptID}`,
    authToken,
    'Fetching document failed'
  )

export const createDocument = (payload: ICreateDocRequest, authToken: string) =>
  post<ManuscriptDocWithSnapshots>(
    `doc/${payload.project_model_id}/manuscript/${payload.manuscript_model_id}`,
    authToken,
    payload,
    'Creating document failed'
  )

export const getTransformVersion = (authToken: string) =>
  get<TransformerVersion>(
    'doc/version',
    authToken,
    'Fetching transform version failed'
  )

export const updateDocument = (
  projectID: string,
  manuscriptID: string,
  authToken: string,
  payload: IUpdateDocumentRequest
) =>
  put<boolean>(
    `doc/${projectID}/manuscript/${manuscriptID}`,
    authToken,
    payload,
    'Updating document failed'
  )

export const deleteDocument = (
  projectID: string,
  manuscriptID: string,
  authToken: string
) =>
  del<boolean>(
    `doc/${projectID}/manuscript/${manuscriptID}`,
    authToken,
    'Deleting document failed'
  )

export const applySteps = async (
  projectId: string,
  docId: string,
  authToken: string,
  payload: StepsPayload
) =>
  post<AppliedStepsResponse>(
    `doc/${projectId}/manuscript/${docId}/steps`,
    authToken,
    payload,
    'Creating document failed'
  )

export const stepsSince = (
  projectId: string,
  docId: string,
  version: number,
  authToken: string
) =>
  get<StepsSinceResponse>(
    `doc/${projectId}/manuscript/${docId}/version/${version}`,
    authToken,
    `Fetching steps since version ${version}`
  )

export const listenStepUpdates = (
  projectID: string,
  manuscriptID: string,
  dataListener: (
    version: number,
    steps: unknown[],
    clientIDs: number[]
  ) => void,
  authToken: string
) => {
  const listener = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    if (
      typeof data.version != 'undefined' &&
      data.steps &&
      Array.isArray(data.steps) &&
      data.clientIDs
    ) {
      dataListener(data.version, data.steps, data.clientIDs)
    }
  }

  listen(
    `doc/${projectID}/manuscript/${manuscriptID}/listen`,
    listener,
    authToken
  )
}
