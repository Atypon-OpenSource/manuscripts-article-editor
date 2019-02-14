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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  BibliographicName,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import { Button, PrimaryButton } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { initials } from '../../lib/name'
import { styled } from '../../theme/styled-components'
import { Badge } from '../Badge'
import { PlaceholderTitle } from '../nav/ProjectDropdown'

const Container = styled.div`
  display: grid;
  margin-right: 5px;
`

const ButtonsContainer = styled(Container)`
  margin-top: -10px;
`
const ProjectNameContainer = styled.div`
  display: flex;
  align-items: center;
`

const InvitedBy = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.dropdown.text.secondary};
  clear: both;
  margin-top: 15px;
`

const AcceptButton = styled(PrimaryButton)`
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => props.theme.colors.dropdown.button.primary};
  padding: 0 8px;

  &:hover {
    color: ${props => props.theme.colors.dropdown.button.primary};
    border-color: ${props => props.theme.colors.dropdown.button.primary};
  }
`

const RejectButton = styled(Button)`
  font-size: 14px;
  font-weight: 500;
  padding: 0 8px;
  color: ${props => props.theme.colors.dropdown.button.secondary};

  &:hover {
    color: ${props => props.theme.colors.dropdown.button.primary};
    border-color: ${props => props.theme.colors.dropdown.button.primary};
  }
`
const AvatarContainer = styled.div`
  margin-left: 6px;
`

const InvitationElement = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin: 0 -5px;
  border: 1px solid transparent;
  border-bottom-color: #eaecee;
  width: 500px;
  border-radius: 4px;

  &:hover {
    background-color: ${props =>
      props.theme.colors.invitation.background.hovered};
    border-color: ${props => props.theme.colors.invitation.border.hovered};
  }

  @media (max-width: 450px) {
    width: unset;
  }
`

const NotificationsBadge = styled(Badge)`
  margin-right: 4px;
  color: ${'white'};
  background-color: ${props =>
    props.theme.colors.dropdown.notification.default};
  font-size: 9px;
  min-width: 10px;
  min-height: 10px;
  font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`

const InvitationTitle = styled.div`
  font-size: 19px;
  font-weight: 500;
  font-style: normal;
  flex: 1;
  color: inherit;
  text-decoration: none;
  display: block;
`

const buildNameLiteral = (name: BibliographicName) =>
  [initials(name), name.family, name.suffix].filter(part => part).join(' ')

interface InvitationProps {
  invitation: ProjectInvitation
  invitingUserProfile: UserProfileWithAvatar
  acceptInvitation: (invitation: ProjectInvitation) => void
  confirmReject: (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ProjectInvitation
  ) => void
}

export const Invitation: React.FunctionComponent<InvitationProps> = ({
  invitation,
  invitingUserProfile,
  acceptInvitation,
  confirmReject,
}) => (
  <InvitationElement>
    <ProjectNameContainer>
      <Container>
        <InvitationTitle>
          {invitation.projectTitle ? (
            <Title value={invitation.projectTitle} />
          ) : (
            <PlaceholderTitle value={'Untitled Invitation'} />
          )}
        </InvitationTitle>
        <InvitedBy>
          <NotificationsBadge> ! </NotificationsBadge>
          Invited by
          <AvatarContainer>
            {buildNameLiteral(invitingUserProfile.bibliographicName)} (
            {invitingUserProfile.email})
          </AvatarContainer>
        </InvitedBy>
      </Container>
    </ProjectNameContainer>
    <ButtonsContainer>
      <AcceptButton onClick={() => acceptInvitation(invitation)}>
        Accept
      </AcceptButton>
      <RejectButton
        onClick={() => confirmReject(invitingUserProfile, invitation)}
      >
        Reject
      </RejectButton>
    </ButtonsContainer>
  </InvitationElement>
)
