import { Manuscript, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (manuscripts: Manuscript[]) => React.ReactNode
  projectID: string
}

interface State {
  manuscripts?: Manuscript[]
}

class ProjectManuscriptsData extends React.Component<
  ModelsProps & Props,
  State
> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { projectID } = this.props

    this.sub = this.loadManuscripts(projectID)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { projectID } = nextProps

    if (projectID !== this.props.projectID) {
      this.sub.unsubscribe()
      this.setState({ manuscripts: undefined })
      this.sub = this.loadManuscripts(projectID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { manuscripts } = this.state

    if (!manuscripts) {
      return <Spinner />
    }

    return this.props.children(manuscripts)
  }

  private loadManuscripts = (containerID: string) => {
    const collection = this.props.models.collection as RxCollection<Manuscript>

    return collection
      .find({
        containerID,
        objectType: ObjectTypes.Manuscript,
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            manuscripts: docs.map(doc => doc.toJSON()),
          })
        }
      })
  }
}

export default withModels<Props>(ProjectManuscriptsData)
