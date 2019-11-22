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

import { RxReplicationState } from '@manuscripts/rxdb'
import { AxiosError } from 'axios'

export interface CollectionEventDetails {
  direction?: string
  operation?: string
  value: boolean
  collection: string
  error?: Error | AxiosError | PouchReplicationError
}

export type CollectionEvent = CustomEvent<CollectionEventDetails>

export type CollectionEventListener = (event: CollectionEvent) => void

export type Direction = 'pull' | 'push'

export type EventType = 'active' | 'complete' | 'error'

export type EventListeners = {
  [key in EventType]: CollectionEventListener[]
}

export type DirectionStatus = { [key in EventType]: boolean }

export type ReplicationStatus = { [key in Direction]: DirectionStatus }

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

export type Replications = { [key in Direction]: RxReplicationState | null }

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
