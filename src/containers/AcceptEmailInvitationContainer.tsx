import { parse } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import Spinner from '../icons/spinner'

class AcceptEmailInvitationContainer extends React.Component<
  RouteComponentProps
> {
  public componentDidMount() {
    window.localStorage.setItem('invitationToken', this.getInvitationToken())
    this.props.history.push('/signup')
  }

  public render() {
    return <Spinner />
  }

  private getInvitationToken = (): string =>
    parse(window.location.hash.substr(1)).token
}

export default AcceptEmailInvitationContainer
