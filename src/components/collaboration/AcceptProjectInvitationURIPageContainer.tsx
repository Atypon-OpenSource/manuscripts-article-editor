import React from 'react'
import { RouteComponentProps } from 'react-router'
import { acceptProjectInvitationToken } from '../../lib/api'
import { AcceptInvitationDialog } from '../projects/AcceptInvitationDialog'
import { Spinner } from '../Spinner'

interface State {
  data?: {
    message: string
    projectId: string
  }
}

interface RouteParams {
  invitationToken: string
}

class AcceptInvitationURIContainer extends React.Component<
  RouteComponentProps<RouteParams>
> {
  public state: Readonly<State> = {}

  public componentDidMount() {
    const { invitationToken } = this.props.match.params

    acceptProjectInvitationToken(invitationToken).then(
      data => {
        this.setState({ data })
      },
      () => {
        // TODO: display an error message?
        this.props.history.push('/projects')
      }
    )
  }

  public render() {
    const { data } = this.state

    return data ? (
      <AcceptInvitationDialog
        message={data.message}
        closeDialog={() => {
          this.props.history.push(`/projects/${data.projectId}`)
        }}
      />
    ) : (
      <Spinner />
    )
  }
}

export default AcceptInvitationURIContainer
