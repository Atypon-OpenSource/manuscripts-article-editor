import { parse } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import invitationTokenHandler from '../../lib/invitation-token'
import { Loading } from '../Loading'

// TODO: what if the user's already signed in?

class AcceptEmailInvitationPageContainer extends React.Component<
  RouteComponentProps
> {
  public componentDidMount() {
    const { token } = parse(window.location.hash.substr(1))
    invitationTokenHandler.set(token)
    this.props.history.push('/signup')
  }

  public render() {
    return <Loading />
  }
}

export default AcceptEmailInvitationPageContainer
