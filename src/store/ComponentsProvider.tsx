import React from 'react'
import { RxCollection } from 'rxdb'
import Spinner from '../icons/spinner'
import sessionID from '../lib/sessionID'
import * as schema from '../schema'
import { AnyComponent, ComponentDocument } from '../types/components'
import DataProvider, {
  ComponentObject,
  DataProviderContext,
} from './DataProvider'

export interface ComponentsProviderContext extends DataProviderContext {
  getComponent: (id: string) => Promise<ComponentDocument> | null
  saveComponent: (
    manuscript: string,
    component: ComponentObject
  ) => Promise<ComponentDocument>
  deleteComponent: (id: string) => Promise<string>
}

export interface ComponentsProps {
  components: ComponentsProviderContext
}

export const ComponentsContext = React.createContext<ComponentsProviderContext | null>(
  null
)

export const withComponents = <T extends {}>(
  Component: React.ComponentType<ComponentsProps>
): React.ComponentType<T> => (props: object) => (
  <ComponentsContext.Consumer>
    {value => (
      <Component {...props} components={value as ComponentsProviderContext} />
    )}
  </ComponentsContext.Consumer>
)

class ComponentsProvider extends DataProvider {
  protected options = {
    name: 'components',
    schema: schema.components,
  }

  protected path = 'manuscript_data'

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
      getComponent: this.getComponent,
      saveComponent: this.saveComponent,
      deleteComponent: this.deleteComponent,
    }

    return (
      <ComponentsContext.Provider value={value}>
        {this.props.children}
      </ComponentsContext.Provider>
    )
  }

  private getCollection() {
    return this.state.collection as RxCollection<AnyComponent>
  }

  private getComponent = (id: string) => {
    return this.getCollection()
      .findOne(id)
      .exec() as Promise<ComponentDocument>
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

            const { id: _id, _rev, ...rest } = component

            Object.entries(rest).forEach(([key, value]) => {
              doc.set(key, value)
              // doc._data[key] = value
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

    return doc.remove().then(() => doc.id)

    // return doc
    //   .atomicUpdate((doc: ComponentDocument) => {
    //     doc._data._deleted = true
    //   })
    //   .then(doc => {
    //     console.log({ doc })
    //     return doc.id
    //   })
  }
}

export default ComponentsProvider
