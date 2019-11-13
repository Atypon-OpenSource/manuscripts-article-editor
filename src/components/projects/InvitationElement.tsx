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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  BibliographicName,
  ContainerInvitation,
} from '@manuscripts/manuscripts-json-schema'
import { PrimaryButton, SecondaryButton } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { initials } from '../../lib/name'
import { styled } from '../../theme/styled-components'
import { Badge } from '../Badge'
import { PlaceholderTitle } from '../nav/Dropdown'

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
  font-size: ${props => props.theme.font.size.normal};
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.text.secondary};
  clear: both;
  margin-top: 15px;
`

const AcceptButton = styled(PrimaryButton)`
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.medium};
  background-color: ${props => props.theme.colors.brand.default};
  padding: 0 ${props => props.theme.grid.unit * 2}px;

  &:hover {
    color: ${props => props.theme.colors.brand.default};
    border-color: ${props => props.theme.colors.brand.default};
  }
`

const RejectButton = styled(SecondaryButton)`
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.medium};
  padding: 0 ${props => props.theme.grid.unit * 2}px;
  color: ${props => props.theme.colors.text.secondary};

  &:hover {
    color: ${props => props.theme.colors.brand.default};
    border-color: ${props => props.theme.colors.brand.default};
  }
`
const AvatarContainer = styled.div`
  margin-left: ${props => props.theme.grid.unit}px;
`

const InvitationElement = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.grid.unit * 4}px;
  box-shadow: 0 1px 0 0 ${props => props.theme.colors.border.secondary};
  width: 100%;
  max-width: 532px;
  border-radius: 0;
  border-top: 1px solid transparent;

  &:hover {
    border-color: ${props => props.theme.colors.border.primary};
    box-shadow: 0 1px 0 0 ${props => props.theme.colors.border.primary};
    background-color: ${props => props.theme.colors.background.fifth};
    border-top-color: ${props => props.theme.colors.border.primary};
  }

  @media (max-width: 480px) {
    width: unset;
  }
`

const NotificationsBadge = styled(Badge)`
  margin-right: 4px;
  color: ${props => props.theme.colors.text.onDark};
  background-color: ${props => props.theme.colors.background.success};
  font-size: 9px;
  min-width: 10px;
  min-height: 10px;
  font-family: ${props => props.theme.font.family.sans};
`

const InvitationTitle = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.medium};
  font-style: normal;
  flex: 1;
  color: inherit;
  text-decoration: none;
  display: block;
`

const buildNameLiteral = (name: BibliographicName) =>
  [initials(name), name.family, name.suffix].filter(part => part).join(' ')

interface InvitationProps {
  invitation: ContainerInvitation
  invitingUserProfile: UserProfileWithAvatar
  acceptInvitation: (invitation: ContainerInvitation) => void
  confirmReject: (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ContainerInvitation
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
          {invitation.containerTitle ? (
            <Title value={invitation.containerTitle} />
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
