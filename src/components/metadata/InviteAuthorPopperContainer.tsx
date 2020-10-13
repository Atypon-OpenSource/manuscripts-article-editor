/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { Contributor, Project } from '@manuscripts/manuscripts-json-schema'
import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import styled from 'styled-components'

import { TokenActions } from '../../data/TokenData'
import { projectInvite } from '../../lib/api/collaboration'
import { trackEvent } from '../../lib/tracking'
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
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
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

    trackEvent({
      category: 'Invitations',
      action: 'Send',
      label: `projectID=${project._id}`,
    })
  }
}

export default InviteAuthorPopperContainer
