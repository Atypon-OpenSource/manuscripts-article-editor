import { Keyword, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (keywords: Map<string, Keyword>) => React.ReactNode
}

interface State {
  keywords?: Map<string, Keyword>
}

class KeywordsData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    this.sub = this.loadKeywords()
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { keywords } = this.state

    if (!keywords) {
      return <Spinner />
    }

    return this.props.children(keywords)
  }

  private loadKeywords = () => {
    const collection = this.props.models.collection as RxCollection<Keyword>

    return collection
      .find({
        objectType: ObjectTypes.Keyword,
      })
      .$.subscribe(docs => {
        if (docs) {
          const keywords: Map<string, Keyword> = new Map()

          for (const doc of docs) {
            keywords.set(doc._id, doc.toJSON())
          }

          this.setState({ keywords })
        }
      })
  }
}

export default withModels<Props>(KeywordsData)
