import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { acceptProjectInvitation } from '../../lib/api'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import {
  AcceptInvitationError,
  AcceptInvitationSuccess,
} from './AcceptInvitationMessages'

interface State {
  accepted?: boolean
}

class AcceptProjectInvitation extends React.Component<ModelsProps, State> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    const invitationId = window.localStorage.getItem('invitationToken')

    if (invitationId) {
      const invitation = await this.loadInvitation(invitationId)

      window.localStorage.removeItem('invitationToken')

      if (invitation) {
        try {
          await acceptProjectInvitation(invitation._id)

          this.setState({
            accepted: true,
          })
        } catch {
          this.setState({
            accepted: false,
          })
        }
      } else {
        this.setState({
          accepted: false,
        })
      }
    }
  }

  public render() {
    const { accepted } = this.state

    if (accepted === undefined) return null

    return accepted ? <AcceptInvitationSuccess /> : <AcceptInvitationError />
  }

  private loadInvitation = async (id: string) => {
    const collection = this.props.models.collection as RxCollection<
      ProjectInvitation
    >

    const doc = await collection.findOne(id).exec()

    return doc ? doc.toJSON() : null
  }
}

export default withModels<{}>(AcceptProjectInvitation)
