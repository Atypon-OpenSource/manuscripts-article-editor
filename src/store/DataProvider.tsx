import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import {
  PouchReplicationOptions,
  RxCollectionCreator,
  RxReplicationState,
} from 'rxdb'
import config from '../config'
import { refreshSyncSessions } from '../lib/api'
import { handleConflicts } from '../lib/conflicts'
import { databaseCreator } from '../lib/db'
import { ComponentCollection } from '../types/components'

// TODO: handle offline/sync problems

export interface ComponentObject {
  // [key: string]: ComponentObject[keyof ComponentObject]
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
}

type Direction = 'push' | 'pull'

export interface DataProviderState {
  active: boolean
  collection: ComponentCollection | null
  push: ReplicationState
  pull: ReplicationState
}

export interface DataProviderContext extends DataProviderState {
  collection: ComponentCollection | null
  sync: (options: PouchReplicationOptions, direction: 'push' | 'pull') => void
}

class DataProvider extends React.Component<{}, DataProviderState> {
  public state: Readonly<DataProviderState> = {
    active: false,
    collection: null,
    pull: {
      active: false,
      completed: false,
    },
    push: {
      active: false,
      completed: false,
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

  protected sync = (options: PouchReplicationOptions, direction: Direction) => {
    console.log('syncing', this.options, options) // tslint:disable-line:no-console

    const collection = this.state.collection as ComponentCollection

    const replication = collection.sync({
      remote: config.gateway.url + '/' + this.path,
      waitForLeadership: false, // TODO: remove this for production
      direction: {
        push: direction === 'push',
        pull: direction === 'pull',
      },
      options,
    })

    return this.addSyncHandlers(replication, options, direction)
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
    direction: Direction
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
          return resolve()
        }
      })

      replication.error$.subscribe(async (error: PouchReplicationError) => {
        try {
          await this.handleSyncError(error, direction)
        } catch (e) {
          // Unhandled sync error
          // Bail out and cancel syncing
          this.setCompletedState(direction, true)

          // await replication.cancel()

          // tslint:disable-next-line:no-console
          console.error('Replication failed due to error', e)
          // reject()
          resolve()
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
