/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AxiosError } from 'axios'
import { RxReplicationState } from 'rxdb'

export interface CollectionEventDetails {
  direction: string
  value: boolean
  error?: Error | AxiosError | PouchReplicationError
}

export type CollectionEvent = CustomEvent<CollectionEventDetails>

export type CollectionEventListener = (event: CollectionEvent) => void

export type Direction = 'pull' | 'push'

export type EventType = 'active' | 'complete' | 'error'

export type EventListeners = { [key in EventType]: CollectionEventListener[] }

export type DirectionStatus = { [key in EventType]: boolean }

export type ReplicationStatus = { [key in Direction]: DirectionStatus }

export interface PouchReplicationError {
  error: string | boolean
  id: string
  rev: string
  message: string
  name?: string
  ok: boolean
  reason?: string
  status: number
  result?: {
    errors: PouchReplicationError[]
    ok: boolean
    status: string
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
