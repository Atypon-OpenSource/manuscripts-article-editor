import React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
import { Spinner } from '../components/Spinner'
import { Build } from '../lib/commands'
import { atomicUpdate } from '../lib/store'
import { KEYWORD } from '../transformer/object-types'
import { Keyword } from '../types/models'
import { ModelsProps, withModels } from './ModelsProvider'

export type KeywordsMap = Map<string, Keyword>

export interface KeywordsProviderState {
  loading: boolean
  loaded: boolean
  data: KeywordsMap | null
  error: string | null
}

export interface KeywordsProviderContext {
  data: KeywordsMap
  create: (data: Build<Keyword>, projectID: string) => Promise<Keyword>
  update: (data: Partial<Keyword>) => Promise<RxDocument<{}>>
}

export interface KeywordsProps {
  keywords: KeywordsProviderContext
}

export const KeywordsContext = React.createContext<KeywordsProviderContext | null>(
  null
)

export const withKeywords = <T extends {}>(
  Component: React.ComponentType<KeywordsProps>
): React.ComponentType<T> => (props: object) => (
  <KeywordsContext.Consumer>
    {value => (
      <Component {...props} keywords={value as KeywordsProviderContext} />
    )}
  </KeywordsContext.Consumer>
)

class KeywordsProvider extends React.Component<
  ModelsProps,
  KeywordsProviderState
> {
  public state: Readonly<KeywordsProviderState> = {
    loading: false,
    loaded: false,
    data: null,
    error: null,
  }

  public componentDidMount() {
    this.subscribe()
  }

  public render() {
    const { data } = this.state

    if (!data) {
      return <Spinner />
    }

    const value = {
      data,
      update: this.update,
      create: this.create,
    }

    return (
      <KeywordsContext.Provider value={value}>
        {this.props.children}
      </KeywordsContext.Provider>
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private subscribe() {
    this.getCollection()
      .find({
        objectType: KEYWORD,
      })
      .$.subscribe((docs: Array<RxDocument<Keyword>>) => {
        this.setState({
          loaded: true,
          data: docs.reduce((output, doc) => {
            output.set(doc._id, doc.toJSON())
            return output
          }, new Map()),
        })
      })
  }

  private create = (data: Build<Keyword>, projectID: string) =>
    this.props.models.saveModel<Keyword>(data, {
      projectID,
    })

  private update = async (data: Partial<Keyword>) => {
    const prev = await this.getCollection()
      .findOne(data._id)
      .exec()

    if (!prev) {
      throw new Error('Keyword object not found')
    }

    return atomicUpdate<Keyword>(prev as RxDocument<Keyword>, data)
  }
}

export default withModels(KeywordsProvider)
