import React from 'react'
import { RxCollection } from 'rxdb'
import Spinner from '../icons/spinner'
import * as schema from '../schema'
import { AnySharedComponent } from '../types/components'
import { DataProviderContext, default as DataProvider } from './DataProvider'

export interface SharedDataProviderContext extends DataProviderContext {
  getSharedComponent: (id: string) => Promise<AnySharedComponent | null>
}

export interface SharedDataProps {
  shared: SharedDataProviderContext
}

export const SharedDataContext = React.createContext<SharedDataProviderContext | null>(
  null
)

export const withSharedData = <T extends {}>(
  Component: React.ComponentType<SharedDataProps>
): React.ComponentType<T> => (props: object) => (
  <SharedDataContext.Consumer>
    {value => (
      <Component {...props} shared={value as SharedDataProviderContext} />
    )}
  </SharedDataContext.Consumer>
)

class SharedDataProvider extends DataProvider {
  protected options = {
    name: 'shared',
    schema: schema.shared,
  }

  protected path = 'manuscripts_shared_data'

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
      getSharedComponent: this.getSharedComponent,
    }

    return (
      <SharedDataContext.Provider value={value}>
        {this.props.children}
      </SharedDataContext.Provider>
    )
  }

  private getSharedComponent = async (id: string) => {
    const collection = this.state.collection as RxCollection<AnySharedComponent>

    const doc = await collection.findOne(id).exec()

    return doc ? doc.toJSON() : null
  }
}

export default SharedDataProvider
