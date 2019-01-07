import { Manuscript } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (manuscript: Manuscript) => React.ReactNode
  manuscriptID: string
}

interface State {
  manuscript?: Manuscript
}

class ManuscriptData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { manuscriptID } = this.props

    this.sub = this.loadManuscript(manuscriptID)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { manuscriptID } = nextProps

    if (manuscriptID !== this.props.manuscriptID) {
      this.sub.unsubscribe()
      this.setState({ manuscript: undefined })
      this.sub = this.loadManuscript(manuscriptID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { manuscript } = this.state

    if (!manuscript) {
      return <Spinner />
    }

    return this.props.children(manuscript)
  }

  private loadManuscript = (manuscriptID: string) => {
    const collection = this.props.models.collection as RxCollection<Manuscript>

    return collection.findOne(manuscriptID).$.subscribe(async doc => {
      if (doc) {
        this.setState({
          manuscript: doc.toJSON(),
        })
      }
    })
  }
}

export default withModels<Props>(ManuscriptData)
