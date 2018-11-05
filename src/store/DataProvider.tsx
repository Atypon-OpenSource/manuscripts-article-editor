import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import {
  PouchReplicationOptions,
  RxCollection,
  RxCollectionCreator,
  RxReplicationState,
} from 'rxdb'
import config from '../config'
import { refreshSyncSessions } from '../lib/api'
import { handleConflicts } from '../lib/conflicts'
import { databaseCreator } from '../lib/db'
import { Model } from '../types/models'

// TODO: handle offline/sync problems

export interface ModelObject {
  // [key: string]: ModelObject[keyof ModelObject]
  [key: string]: any // tslint:disable-line:no-any
}

interface PouchReplicationError {
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

export interface ReplicationState {
  active: boolean
  completed: boolean
  replication: RxReplicationState | null
}

type Direction = 'push' | 'pull'

export interface DataProviderState {
  active: boolean
  collection: RxCollection<Model> | null
  push: ReplicationState
  pull: ReplicationState
}

export interface DataProviderContext extends DataProviderState {
  collection: RxCollection<Model> | null
  sync: (options: PouchReplicationOptions, direction: 'push' | 'pull') => void
}

class DataProvider extends React.Component<{}, DataProviderState> {
  public state: Readonly<DataProviderState> = {
    active: false,
    collection: null,
    pull: {
      active: false,
      completed: false,
      replication: null,
    },
    push: {
      active: false,
      completed: false,
      replication: null,
    },
  }

  protected options: RxCollectionCreator
  protected path: string

  public async componentDidMount() {
    const { name } = this.options

    const db = await databaseCreator

    if (!db[name]) {
      await db.collection(this.options)
    }

    this.setState({
      collection: db[name],
    })

    // TODO: only sync when there's a token?

    // wait for initial pull of data to finish
    await this.sync({ live: false, retry: true }, 'pull')

    // start ongoing pull sync
    // tslint:disable-next-line:no-floating-promises
    this.sync({ live: true, retry: true }, 'pull')

    // start ongoing push sync
    // tslint:disable-next-line:no-floating-promises
    this.sync({ live: true, retry: true }, 'push') // ongoing push sync
  }

  protected sync = (
    options: PouchReplicationOptions,
    direction: Direction,
    isRetry: boolean = false
  ) => {
    const replicationState = this.state[direction]

    if (replicationState.replication) {
      throw new Error('Existing replication in progress')
    }

    console.log('syncing', this.options, options) // tslint:disable-line:no-console

    const collection = this.state.collection as RxCollection<Model>

    const replication = collection.sync({
      remote: config.gateway.url + '/' + this.path,
      waitForLeadership: false, // TODO: remove this for production
      direction: {
        push: direction === 'push',
        pull: direction === 'pull',
      },
      options,
    })

    this.setReplicationState(direction, replication)

    return this.addSyncHandlers(replication, options, direction, isRetry)
  }

  private cancelReplication = async (
    replication: RxReplicationState,
    direction: Direction
  ) => {
    await replication.cancel()
    this.state[direction].replication = null
  }

  private setReplicationState(direction: Direction, value: RxReplicationState) {
    // TODO: make this typed somehow (i.e. no object assign)
    this.setState({
      ...this.state,
      [direction]: {
        ...this.state[direction],
        replication: value,
      },
    })
  }

  private setCompletedState(direction: Direction, value: boolean) {
    // TODO: make this typed somehow (i.e. no object assign)
    this.setState({
      ...this.state,
      [direction]: {
        ...this.state[direction],
        completed: value,
      },
    })
  }

  private setActiveState(direction: Direction, value: boolean) {
    // TODO: make this typed somehow (i.e. no object assign)
    this.setState({
      ...this.state,
      [direction]: {
        ...this.state[direction],
        active: value,
      },
    })
  }

  // Returns a promise that resolves when syncing completes successfully
  // `live: true` syncs never complete
  private addSyncHandlers = (
    replication: RxReplicationState,
    options: PouchReplicationOptions,
    direction: Direction,
    isRetry: boolean
  ) => {
    return new Promise((resolve, reject) => {
      replication.active$.subscribe(active => {
        this.setActiveState(direction, active)
      })

      // For `live: true` the replication never completes
      replication.complete$.subscribe(completed => {
        console.log({ completed }) // tslint:disable-line:no-console

        if (completed) {
          this.setCompletedState(direction, true)
          // It is easier to just cancel this (despite it being "over" anyway)
          return this.cancelReplication(replication, direction).then(() => {
            return resolve()
          })
        }
      })

      replication.error$.subscribe(async (error: PouchReplicationError) => {
        try {
          await this.handleSyncError(error, direction)

          if (isRetry) {
            // successfully handled sync error but failed again, move on
            this.setCompletedState(direction, true)
          } else {
            // cancel this replication
            await this.cancelReplication(replication, direction)
            // try once more, after refreshing the sync session
            await this.sync(options, direction, true)
          }

          resolve()
        } catch (e) {
          // Unhandled sync error
          // Bail out and cancel syncing
          this.setCompletedState(direction, true)

          // await replication.cancel()

          // tslint:disable-next-line:no-console
          console.error('Replication failed due to error', e)
          // reject()
        }
      })
    })
  }

  private handleSyncError = async (
    error: PouchReplicationError,
    direction: Direction
  ) => {
    if (direction === 'push') {
      if (error.error === 'conflict' && error.result && error.result.errors) {
        const conflicts = error.result.errors
          .filter(e => e.error === 'conflict')
          .map(({ id, rev }) => ({ id, rev }))

        const collection = this.state.collection

        if (!collection) {
          throw new Error('Collection not initialized')
        }

        return handleConflicts(collection, conflicts)
      }
    }

    switch (error.status) {
      // unauthorized, start a new sync gateway session if signed in
      case HttpStatusCodes.UNAUTHORIZED:
        return refreshSyncSessions()

      default:
        throw error
    }
  }
}

export default DataProvider
