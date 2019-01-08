import {
  ObjectTypes,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (invitations: ProjectInvitation[]) => React.ReactNode
  projectID: string
}

interface State {
  invitations?: ProjectInvitation[]
}

class ProjectInvitationsData extends React.Component<
  ModelsProps & Props,
  State
> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { projectID } = this.props

    this.sub = this.loadInvitations(projectID)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { projectID } = nextProps

    if (projectID !== this.props.projectID) {
      this.sub.unsubscribe()
      this.setState({ invitations: undefined })
      this.sub = this.loadInvitations(projectID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { invitations } = this.state

    if (!invitations) {
      return <Spinner />
    }

    return this.props.children(invitations)
  }

  private loadInvitations = (containerID: string) => {
    const collection = this.props.models.collection as RxCollection<
      ProjectInvitation
    >

    return collection
      .find({
        containerID,
        objectType: ObjectTypes.Invitation,
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            invitations: docs.map(doc => doc.toJSON()),
          })
        }
      })
  }
}

export default withModels<Props>(ProjectInvitationsData)
