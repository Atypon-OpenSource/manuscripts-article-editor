import { Manuscript } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (data: Manuscript) => React.ReactNode
  manuscriptID: string
  projectID: string
}

interface State {
  data?: Manuscript
}

class ManuscriptData extends DataComponent<Manuscript, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<Manuscript>(
      `project-${props.projectID}`
    )
  }

  public componentDidMount() {
    const { manuscriptID } = this.props

    this.collection.addEventListener('complete', this.handleComplete)

    this.sub = this.subscribe(manuscriptID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { manuscriptID, projectID } = nextProps

    if (
      manuscriptID !== this.props.manuscriptID ||
      projectID !== this.props.projectID
    ) {
      this.sub.unsubscribe()

      this.setState({ data: undefined })

      if (projectID !== this.props.projectID) {
        this.collection.removeEventListener('complete', this.handleComplete)

        this.collection = CollectionManager.getCollection<Manuscript>(
          `project-${projectID}`
        )

        this.collection.addEventListener('complete', this.handleComplete)
      }

      this.sub = this.subscribe(manuscriptID)
    }
  }

  public componentWillUnmount() {
    this.collection.removeEventListener('complete', this.handleComplete)
    this.sub.unsubscribe()
  }

  private subscribe = (manuscriptID: string) =>
    this.collection.findOne(manuscriptID).$.subscribe(async doc => {
      if (doc) {
        this.setState({
          data: doc.toJSON(),
        })
      }
    })
}

export default ManuscriptData
