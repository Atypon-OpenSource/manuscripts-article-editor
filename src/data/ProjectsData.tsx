import { ObjectTypes, Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (projects: Project[]) => React.ReactNode
}

interface State {
  projects?: Project[]
}

class ProjectsData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    this.sub = this.loadProjects()
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { projects } = this.state

    if (!projects) {
      return <Spinner />
    }

    return this.props.children(projects)
  }

  private loadProjects = () => {
    const collection = this.props.models.collection as RxCollection<Project>

    return collection
      .find({
        objectType: ObjectTypes.Project,
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            projects: docs.map(doc => doc.toJSON()),
          })
        }
      })
  }
}

export default withModels<Props>(ProjectsData)
