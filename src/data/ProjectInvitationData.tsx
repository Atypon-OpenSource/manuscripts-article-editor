import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (invitation: ProjectInvitation) => React.ReactNode
  invitationId: string
}

interface State {
  invitation?: ProjectInvitation
}

class ProjectInvitationData extends React.Component<
  Props & ModelsProps,
  State
> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { invitationId } = this.props

    this.sub = this.loadInvitation(invitationId)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { invitationId } = nextProps

    if (invitationId !== this.props.invitationId) {
      this.sub.unsubscribe()
      this.setState({ invitation: undefined })
      this.sub = this.loadInvitation(invitationId)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { invitation } = this.state

    if (!invitation) {
      return <Spinner />
    }

    return this.props.children(invitation)
  }

  private loadInvitation = (invitationId: string) => {
    const collection = this.props.models.collection as RxCollection<
      ProjectInvitation
    >

    return collection.findOne(invitationId).$.subscribe(async doc => {
      if (doc) {
        this.setState({
          invitation: doc.toJSON(),
        })
      }
    })
  }
}

export default withModels<Props>(ProjectInvitationData)
