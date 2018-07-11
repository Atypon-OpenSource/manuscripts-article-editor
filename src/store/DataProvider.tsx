import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { RxCollectionCreator, RxReplicationState } from 'rxdb'
import { PouchReplicationOptions } from 'rxdb/src/typings/pouch'
import config from '../config'
import * as api from '../lib/api'
import { Db, waitForDB } from '../lib/rxdb'
import { ComponentCollection } from '../types/components'

// TODO: handle offline/sync problems

export interface ComponentObject {
  // [key: string]: ComponentObject[keyof ComponentObject]
  [key: string]: any // tslint:disable-line:no-any
}

export interface DataProviderState {
  active: boolean
  collection: ComponentCollection | null
  completed: object | boolean
  error: string | null
  replication: RxReplicationState | null
}

export interface DataProviderContext extends DataProviderState {
  collection: ComponentCollection | null
  sync: (options: PouchReplicationOptions) => void
}

class DataProvider extends React.Component<{}, DataProviderState> {
  public state: Readonly<DataProviderState> = {
    active: false,
    collection: null,
    completed: false,
    error: null,
    replication: null,
  }

  protected options: RxCollectionCreator
  protected path: string

  public async componentDidMount() {
    const { name } = this.options

    const db: Db = await waitForDB

    if (!db[name]) {
      await db.collection(this.options)
    }

    this.setState({
      collection: db[name],
    })

    // TODO: only sync when there's a token?

    this.sync({ live: false }) // initial sync
  }

  protected sync = (options: PouchReplicationOptions = {}) => {
    this.setState({ error: null })

    // return this.setState({ completed: true })

    console.log('syncing', this.options, options) // tslint:disable-line:no-console

    const collection = this.state.collection as ComponentCollection

    const replication = collection.sync({
      remote: config.gateway.url + this.path,
      waitForLeadership: false, // TODO: remove this for production
      options,
    })

    replication.active$.subscribe(active => {
      this.setState({ active })
    })

    replication.complete$.subscribe(completed => {
      console.log({ completed }) // tslint:disable-line:no-console

      if (completed) {
        this.setState({ completed: true })

        if (!options.live) {
          // start live syncing
          this.sync({ live: true })
        }
      }
    })

    replication.error$.subscribe((error: PouchDB.Core.Error) => {
      console.error(error) // tslint:disable-line:no-console

      replication
        .cancel()
        .then(() => {
          this.handleSyncError(error)
            .then(() => {
              this.sync(options)
            })
            .catch(() => {
              this.setState({
                completed: true, // continue offline if necessary
                error: error.message || null,
              })
            })
        })
        .catch(e => {
          // tslint:disable-next-line:no-console
          console.error('Replication failed due to error', e)
        })
    })

    // replication.change$.subscribe(change => {
    //   console.dir({ change })
    // })
    //
    // replication.docs$.subscribe(docData => {
    //   console.dir({ docData })
    // })

    return replication
  }

  private handleSyncError = async (error: PouchDB.Core.Error) => {
    switch (error.status) {
      // unauthorized, start a new sync gateway session if signed in
      case HttpStatusCodes.UNAUTHORIZED:
        return api.refreshSyncSession()

      default:
        throw error
    }
  }
}

export default DataProvider
