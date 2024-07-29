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
// eslint-disable-next-line import/no-unresolved
import { JsonValue } from 'type-fest'

export type ManuscriptSnapshot = {
  id: string
  name: string
  snapshot: JsonValue
  createdAt: Date
  doc_id: string
}

export type ManuscriptDoc = {
  manuscript_model_id: string
  user_model_id: string
  project_model_id: string
  doc: JsonValue
  createdAt: Date
  updatedAt: Date
  version: number
}
export type SnapshotLabel = Pick<
  ManuscriptSnapshot,
  'id' | 'name' | 'createdAt'
>

export type ManuscriptDocWithSnapshots = ManuscriptDoc & {
  snapshots: SnapshotLabel[]
}

export type TransformerVersion = {
  transformerVersion: string
}

export type UpdateDocumentRequest = {
  doc: Record<string, any>
}

export interface CreateDocRequest {
  manuscript_model_id: string
  project_model_id: string
  doc: Record<string, any>
}

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

export type StepsSinceResponse = {
  steps: unknown[]
  version: number
  clientIDs: number[]
}

export type IGetSnapshotResponse = ManuscriptSnapshot

export interface ISaveSnapshotResponse {
  snapshot: ManuscriptSnapshot
}

export interface ICreateDocRequest {
  manuscript_model_id: string
  project_model_id: string
  doc: Record<string, any>
  schema_version: string
}
export type ICreateDocResponse = ManuscriptDocWithSnapshots

export type IUpdateDocumentRequest = {
  doc: Record<string, any>
  version?: number
  schema_version: string
}
