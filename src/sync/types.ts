/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { AxiosError } from 'axios'

export type Direction = 'pull' | 'push'

export type ReplicationStatus = 'active' | 'ready' | 'cancelled' | null

type PouchReplicationErrorNames =
  | 'Unauthorized'
  | 'Bad Request'
  | 'Not Found'
  | 'Conflict'
  | 'Missing Id'
  | 'Precondition Failed'
  | 'Unknown Error'
  | 'Invalid Request'
  | 'Query Parse Error'
  | 'Doc Validation'
  | 'Badarg'
  | 'Forbidden'

export interface PouchReplicationError {
  error: string | boolean
  message: string
  name: PouchReplicationErrorNames
  reason: string
  status: number // HTTP status
  result: {
    doc_write_failures: number
    docs_read: number
    docs_written: number
    end_time: string
    errors: Array<{
      error: string
      id: string
      rev: string
    }>
    last_seq: number
    ok: boolean
    start_time: string
    status: string // descriptive status e.g. "aborting"
  }
}

export interface BulkDocsSuccess {
  ok: boolean
}

export interface BulkDocsError {
  status: number
  name: string
  message: string
  error: boolean
  id: string
}

export interface CollectionMeta {
  isProject: boolean
  remoteUrl: string
  backupUrl: string
  channels: string[]
}

export interface ErrorEvent {
  timestamp: number
  direction?: string
  operation?: string
  error: Error | AxiosError | PouchReplicationError
  ack: boolean
  collectionName?: string
}

export interface CollectionState {
  firstPullComplete: boolean | 'error'
  push: ReplicationStatus
  pull: ReplicationStatus
  backupPullComplete: boolean
  backupPush: ReplicationStatus
  errors: ErrorEvent[]
  errorDocIds: string[]
  closed: boolean | 'zombie'
}

export interface SyncState {
  [key: string]: {
    meta: CollectionMeta
    state: CollectionState
  }
}

export interface Action {
  type: string
  payload: { [key: string]: any } // tslint:disable-line:no-any
  collectionName?: string
}
