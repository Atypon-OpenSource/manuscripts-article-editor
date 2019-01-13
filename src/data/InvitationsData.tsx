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
}

interface State {
  invitations?: ProjectInvitation[]
}

class InvitationsData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    this.sub = this.loadInvitations()
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

  private loadInvitations = () => {
    const collection = this.props.models.collection as RxCollection<
      ProjectInvitation
    >

    return collection
      .find({
        objectType: ObjectTypes.ProjectInvitation,
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

export default withModels<Props>(InvitationsData)
