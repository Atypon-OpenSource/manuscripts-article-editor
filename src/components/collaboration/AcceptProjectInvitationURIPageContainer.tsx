import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { acceptProjectInvitationToken } from '../../lib/api'
import { Spinner } from '../Spinner'

interface State {
  loading: boolean
  success: boolean
  message: string
  projectID: string | null
}

interface RouteParams {
  invitationToken: string
}

class AcceptInvitationURIContainer extends React.Component<
  RouteComponentProps<RouteParams>
> {
  public state: State = {
    loading: true,
    success: false,
    projectID: null,
    message: '',
  }

  public async componentDidMount() {
    const { invitationToken } = this.props.match.params
    try {
      const {
        data: { message, projectId },
      } = await acceptProjectInvitationToken(invitationToken)

      this.setState({
        loading: false,
        success: true,
        projectID: projectId || null,
        message,
      })
    } catch (error) {
      this.setState({
        loading: false,
        success: false,
        projectID: null,
        message: '',
      })
    }
  }

  public render() {
    const { success, loading, projectID, message } = this.state

    if (loading) {
      return <Spinner />
    }

    if (!success) {
      alert(message)
      return <Redirect to={'/projects'} />
    } else {
      return <Redirect to={`/projects/${projectID}`} />
    }
  }
}

export default AcceptInvitationURIContainer
