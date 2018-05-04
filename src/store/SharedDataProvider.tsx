import React from 'react'
import { RxDocument, RxQuery } from 'rxdb'
import Spinner from '../icons/spinner'
import * as schema from '../schema'
import { AnyComponent, ComponentCollection } from '../types/components'
import { DataProviderContext, default as DataProvider } from './DataProvider'

export interface SharedDataProviderContext extends DataProviderContext {
  findSharedComponents: () => RxQuery<
    AnyComponent,
    Array<RxDocument<AnyComponent>>
  >
}

export interface SharedDataProps {
  shared: SharedDataProviderContext
}

export const SharedDataContext = React.createContext<
  SharedDataProviderContext
>()

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
      ...this.getValue(),
      findSharedComponents: this.findSharedComponents,
    }

    return (
      <SharedDataContext.Provider value={value}>
        {this.props.children}
      </SharedDataContext.Provider>
    )
  }

  private findSharedComponents = () => {
    const collection = this.state.collection as ComponentCollection

    return collection.find()
  }
}

export default SharedDataProvider
