import { RxReplicationState } from 'rxdb'

export type CollectionEventListener = (event: CustomEvent) => void

export type Direction = 'pull' | 'push'

export type EventType = 'active' | 'complete' | 'error'

export type EventListeners = { [key in EventType]: CollectionEventListener[] }

export type DirectionStatus = { [key in EventType]: boolean }

export type ReplicationStatus = { [key in Direction]: DirectionStatus }

export interface PouchReplicationError {
  error: string
  id: string
  rev: string
  message: string
  name: string
  ok: boolean
  reason: string
  status: number
  result?: {
    errors: PouchReplicationError[]
  }
}

export type Replications = { [key in Direction]: RxReplicationState | null }
