import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { Spinner } from '../components/Spinner'
import { acceptProjectInvitationToken } from '../lib/api'
import { UserProps, withUser } from '../store/UserProvider'

interface State {
  loading: boolean
  success: boolean
  message: string
  projectID: string | null
}

interface RouteParams {
  invitationToken: string
}

class AcceptInvitationContainer extends React.Component<
  RouteComponentProps<RouteParams> & UserProps
> {
  public state: State = {
    loading: true,
    success: false,
    projectID: null,
    message: '',
  }

  public async componentDidMount() {
    const { invitationToken } = this.props.match.params
    await acceptProjectInvitationToken(invitationToken)
      .then(response => {
        this.setState({
          loading: false,
          success: true,
          projectID: response.projectId || null,
          message: response.message,
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          success: false,
          projectID: null,
          message: '',
        })
      })
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

export default withUser(AcceptInvitationContainer)
