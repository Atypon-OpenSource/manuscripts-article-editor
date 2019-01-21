import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { aliceBlue, aquaHaze } from '../../colors'
import { initials } from '../../lib/name'
import { styled, ThemedProps } from '../../theme'
import { Badge } from '../Badge'
import { Button, PrimaryButton } from '../Button'
import { PlaceholderTitle } from '../nav/ProjectDropdown'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const Container = styled.div`
  display: grid;
  margin-right: 5px;
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
  color: ${(props: ThemedDivProps) =>
    props.theme.colors.dropdown.text.secondary};
  clear: both;
  margin-top: 20px;
`

const AcceptButton = styled(PrimaryButton)`
  font-size: 14px;
  font-weight: 500;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.dropdown.button.primary};
  padding: 0 8px;

  &:hover {
    color: ${(props: ThemedDivProps) =>
      props.theme.colors.dropdown.button.primary};
    border-color: ${(props: ThemedDivProps) =>
      props.theme.colors.dropdown.button.primary};
  }
`

const RejectButton = styled(Button)`
  font-size: 14px;
  font-weight: 500;
  padding: 0 8px;
  color: ${(props: ThemedDivProps) =>
    props.theme.colors.dropdown.button.secondary};

  &:hover {
    color: ${(props: ThemedDivProps) =>
      props.theme.colors.dropdown.button.secondary};
    border-color: ${(props: ThemedDivProps) =>
      props.theme.colors.dropdown.button.secondary};
  }
`
const AvatarContainer = styled.div`
  display: flex;
  margin-left: 6px;
  align-items: center;
`

const InvitedByText = styled.div`
  height: 20px;
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
    background-color: ${aliceBlue};
    border-color: ${aquaHaze};
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
  rejectInvitation: (invitation: ProjectInvitation) => void
}

export const Invitation: React.FunctionComponent<InvitationProps> = ({
  invitation,
  invitingUserProfile,
  acceptInvitation,
  rejectInvitation,
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
          <InvitedByText>Invited by</InvitedByText>
          <AvatarContainer>
            {buildNameLiteral(invitingUserProfile.bibliographicName)} (
            {invitingUserProfile.email})
          </AvatarContainer>
        </InvitedBy>
      </Container>
    </ProjectNameContainer>
    <Container>
      <AcceptButton onClick={() => acceptInvitation(invitation)}>
        Accept
      </AcceptButton>
      <RejectButton onClick={() => rejectInvitation(invitation)}>
        Reject
      </RejectButton>
    </Container>
  </InvitationElement>
)
