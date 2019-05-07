/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Contributor, Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { TokenActions } from '../../data/TokenData'
import { projectInvite } from '../../lib/api/collaboration'
import { styled } from '../../theme/styled-components'
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
  tokenActions: TokenActions
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
    const { popperProps, author, tokenActions } = this.props
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
            tokenActions={tokenActions}
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
