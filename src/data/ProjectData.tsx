import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (project: Project) => React.ReactNode
  projectID: string
}

interface State {
  project?: Project
}

class ProjectData extends React.Component<Props & ModelsProps, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { projectID } = this.props

    this.sub = this.loadProject(projectID)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { projectID } = nextProps

    if (projectID !== this.props.projectID) {
      this.sub.unsubscribe()
      this.setState({ project: undefined })
      this.sub = this.loadProject(projectID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { project } = this.state

    if (!project) {
      return <Spinner />
    }

    return this.props.children(project)
  }

  private loadProject = (projectID: string) => {
    const collection = this.props.models.collection as RxCollection<Project>

    return collection.findOne(projectID).$.subscribe(async doc => {
      if (doc) {
        this.setState({
          project: doc.toJSON(),
        })
      }
    })
  }
}

export default withModels<Props>(ProjectData)
