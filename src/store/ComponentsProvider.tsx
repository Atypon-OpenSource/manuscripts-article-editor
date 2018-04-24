import * as React from 'react'
import { RxCollection, RxCollectionCreator, RxReplicationState } from 'rxdb'
import { PouchReplicationOptions } from 'rxdb/src/typings/pouch'
import { waitForDB } from '../db'
import Spinner from '../icons/spinner'
import sessionID from '../lib/sessionID'
import * as schema from '../schema'
import {
  AnyComponent,
  ComponentCollection,
  ComponentDocument,
} from '../types/components'

// tslint:disable:no-console

// TODO: handle offline/sync problems

export interface ComponentsProviderState {
  active: boolean
  collection: ComponentCollection | null
  completed: object | boolean
  error: string | null
  replication: RxReplicationState | null
}

export interface ComponentsProviderContext extends ComponentsProviderState {
  sync: (options: PouchReplicationOptions) => void
  loadManuscriptComponents: (id: string) => Promise<ComponentDocument[]>
  saveComponent: (
    manuscript: string,
    component: ComponentObject
  ) => Promise<ComponentDocument>
  deleteComponent: (id: string) => Promise<string>
}

export interface ComponentsProps {
  components: ComponentsProviderContext
}

export const ComponentsContext = React.createContext<
  ComponentsProviderContext
>()

export interface ComponentObject {
  [key: string]: any // tslint:disable-line:no-any
}

export const withComponents = (
  // tslint:disable-next-line:no-any
  Component: React.ComponentType<any>
  // tslint:disable-next-line:no-any
): React.ComponentType<any> => (props: object) => (
  <ComponentsContext.Consumer>
    {value => (
      <Component {...props} components={value as ComponentsProviderContext} />
    )}
  </ComponentsContext.Consumer>
)

class ComponentsProvider extends React.Component {
  public state: ComponentsProviderState = {
    active: false,
    collection: null,
    completed: false,
    error: null,
    replication: null,
  }

  public async componentDidMount() {
    const db = await waitForDB

    const options = {
      name: 'components',
      schema: schema.components,
    }

    const collection = await db.collection(options as RxCollectionCreator)

    this.setState({ collection })

    // initial sync
    const replication = this.sync({
      live: false,
    })

    replication.complete$.subscribe(completed => {
      if (completed) {
        // TODO: check for errors in the `completed` object?

        // live sync
        this.sync({
          live: true,
        })

        this.setState({ completed })
      }
    })

    replication.error$.subscribe((error: Error) => {
      console.error(error)
      this.setState({
        completed: true, // continue offline
        error: error.message,
      })
    })
  }

  public render() {
    // if (!this.state.replication) {
    //   return <Spinner />
    // }

    if (!this.state.completed) {
      return <Spinner color={'green'} />
    }

    const value = {
      ...this.state,
      sync: this.sync,
      loadManuscriptComponents: this.loadManuscriptComponents,
      saveComponent: this.saveComponent,
      deleteComponent: this.deleteComponent,
    }

    return (
      <ComponentsContext.Provider value={value}>
        {this.props.children}
      </ComponentsContext.Provider>
    )
  }

  private sync = (options: PouchReplicationOptions = {}) => {
    this.setState({
      error: null,
    })

    console.log('syncing', options) // tslint:disable-line:no-console

    const collection = this.state.collection as ComponentCollection

    const replication = collection.sync({
      remote: process.env.SYNC_GATEWAY_URL + 'manuscript_data',
      waitForLeadership: false, // TODO: remove this for production
      options,
    })

    replication.active$.subscribe(active => {
      this.setState({ active })
    })

    replication.complete$.subscribe(completed => {
      console.log({ completed }) // tslint:disable-line:no-console
    })

    replication.error$.subscribe((error: Error) => {
      console.error(error)
      this.setState({
        error: error.message,
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

  private loadManuscriptComponents = (manuscript: string) => {
    const collection = this.state.collection as RxCollection<AnyComponent>

    return collection.find({ manuscript }).exec() as Promise<
      ComponentDocument[]
    >
  }

  private saveComponent = (manuscript: string, component: ComponentObject) => {
    const collection = this.state.collection as RxCollection<AnyComponent>

    return collection
      .findOne({ id: component.id })
      .exec()
      .then(prev => {
        const now = Date.now()

        if (prev) {
          return prev.atomicUpdate((doc: ComponentDocument) => {
            doc.set('manuscript', manuscript)
            doc.set('updatedAt', now)
            doc.set('sessionID', sessionID)

            // delete doc._deleted

            const { id: _id, ...rest } = component

            Object.entries(rest).forEach(([key, value]) => {
              doc.set(key, value)
            })
          }) as Promise<ComponentDocument>
        }

        return collection.insert({
          ...component,
          manuscript,
          createdAt: now,
          updatedAt: now,
          sessionID,
        }) as Promise<ComponentDocument>
      })
  }

  // NOTE: marking the document as "deleted" instead of removing it
  // https://github.com/pouchdb/pouchdb/issues/4628#issuecomment-164210176

  private deleteComponent = async (id: string) => {
    const collection = this.state.collection as RxCollection<AnyComponent>

    const doc = await collection.findOne(id).exec()

    if (!doc) {
      throw new Error('Not found')
    }

    return doc
      .atomicUpdate((doc: ComponentDocument) => {
        doc.set('_deleted', true)
      })
      .then(doc => doc.id)
  }
}

export default ComponentsProvider
