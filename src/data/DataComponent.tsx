import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Subscription } from 'rxjs'
import { Loading } from '../components/Loading'
import { Collection } from '../sync/Collection'

export abstract class DataComponent<
  T extends Model,
  Props extends {
    children: (
      data: T | T[] | Map<string, T> | null,
      collection: Collection<T>
    ) => React.ReactNode
    // placeholder?: React.ReactChild
  },
  State extends { data?: T | T[] | Map<string, T> | null }
> extends React.PureComponent<Props, State> {
  protected collection: Collection<T>
  protected sub: Subscription

  public render() {
    if (!this.isComplete()) {
      return <Loading />
      // return this.props.placeholder || <Loading />
    }

    return this.props.children(this.state.data!, this.collection)
  }

  protected isComplete = () => {
    // tslint:disable-next-line:strict-type-predicates
    return this.collection.status.pull.complete && this.state.data !== undefined
  }

  protected handleComplete = () => {
    this.forceUpdate()
  }
}
