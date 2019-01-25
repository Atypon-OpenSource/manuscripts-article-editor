import {
  ObjectTypes,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (data: ProjectInvitation[]) => React.ReactNode
  projectID: string
}

interface State {
  data?: ProjectInvitation[]
}

class ProjectInvitationsData extends DataComponent<
  ProjectInvitation,
  Props,
  State
> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<ProjectInvitation>(
      `project-${props.projectID}`
    )
  }

  public componentDidMount() {
    const { projectID } = this.props

    this.collection.addEventListener('complete', this.handleComplete)

    this.sub = this.subscribe(projectID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { projectID } = nextProps

    if (projectID !== this.props.projectID) {
      this.sub.unsubscribe()

      this.setState({ data: undefined })

      this.collection.addEventListener('complete', this.handleComplete)

      this.collection = CollectionManager.getCollection<ProjectInvitation>(
        `project-${projectID}`
      )

      this.collection.removeEventListener('complete', this.handleComplete)

      this.sub = this.subscribe(projectID)
    }
  }

  public componentWillUnmount() {
    this.collection.removeEventListener('complete', this.handleComplete)

    this.sub.unsubscribe()
  }

  private subscribe = (projectID: string) =>
    this.collection
      .find({
        projectID,
        objectType: ObjectTypes.ProjectInvitation,
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            data: docs.map(doc => doc.toJSON()),
          })
        }
      })
}

export default ProjectInvitationsData
