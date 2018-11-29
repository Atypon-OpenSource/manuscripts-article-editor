import { Contributor, Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { projectInvite } from '../../lib/api/collaboration'
import { styled } from '../../theme'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import {
  InvitationForm,
  InvitationValues,
} from '../collaboration/InvitationForm'
import { CustomUpPopper, PopperBody } from '../Popper'

interface Props {
  popperProps: PopperChildrenProps
  project: Project
  author: Contributor
  updateAuthor: (author: Contributor, email: string) => void
}

interface State {
  invitationError: Error | null
}

const AlertMessageContainer = styled.div`
  margin-bottom: 9px;
`

class InviteAuthorPopperContainer extends React.Component<Props> {
  public state: State = {
    invitationError: null,
  }

  public render() {
    const { popperProps, author } = this.props
    const { invitationError } = this.state
    return (
      <CustomUpPopper popperProps={popperProps}>
        <PopperBody>
          {!!invitationError && (
            <AlertMessageContainer>
              <AlertMessage
                type={AlertMessageType.error}
                hideCloseButton={true}
              >
                Sending invitation failed.
              </AlertMessage>
            </AlertMessageContainer>
          )}
          <InvitationForm
            invitationValues={{
              email: author.email || '',
              name:
                author.bibliographicName.given +
                ' ' +
                author.bibliographicName.family,
              role: 'Writer',
            }}
            handleSubmit={this.handleInvitationSubmit}
            allowSubmit={true}
          />
        </PopperBody>
      </CustomUpPopper>
    )
  }

  private handleInvitationSubmit = async (values: InvitationValues) => {
    const { project } = this.props
    const { email, name, role } = values

    await projectInvite(project._id, [{ email, name }], role)
    this.props.updateAuthor(this.props.author, email)
  }
}

export default InviteAuthorPopperContainer
