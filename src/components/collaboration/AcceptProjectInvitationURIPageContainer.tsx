import React from 'react'
import { RouteComponentProps } from 'react-router'
import { acceptProjectInvitationToken } from '../../lib/api'
import { Spinner } from '../Spinner'

interface RouteParams {
  invitationToken: string
}

class AcceptInvitationURIContainer extends React.Component<
  RouteComponentProps<RouteParams>
> {
  public async componentDidMount() {
    const { invitationToken } = this.props.match.params

    try {
      const {
        data: { message, projectId },
      } = await acceptProjectInvitationToken(invitationToken)

      this.props.history.push({
        pathname: `/projects/${projectId}`,
        state: { message },
      })
    } catch (error) {
      this.props.history.push('/projects')
    }
  }

  public render() {
    return <Spinner />
  }
}

export default AcceptInvitationURIContainer
