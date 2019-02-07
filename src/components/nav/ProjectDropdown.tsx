import ProjectsList from '@manuscripts/assets/react/ProjectsList'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import { Button, PrimaryButton } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import ProjectIcon from '../../icons/project'
import ProjectNotification from '../../icons/project-notification'
import TickMark from '../../icons/tick-mark'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'
import { Avatar } from '../Avatar'
import { DropdownElement, DropdownLink } from './Dropdown'

const activeStyle = {
  fontWeight: 600,
}

const DropdownIcon = styled.div`
  display: flex;
  padding-right: 10px;
`

const DropdownWithNotificationIcon = styled.div`
  display: flex;
  padding-right: 4px;
`

const ButtonsContainer = styled.div`
  display: grid;
`

const ProjectNameContainer = styled.div`
  display: flex;
  align-items: center;
`

export const InvitedBy = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.dropdown.text.secondary};
  clear: both;
  margin-top: 6px;
`

const AcceptButton = styled(PrimaryButton)`
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => props.theme.colors.dropdown.button.primary};
  padding: 0 8px;

  &:hover {
    color: white;
    border-color: white;
  }
`

const RejectButton = styled(Button)`
  font-size: 14px;
  font-weight: 500;
  padding: 0 8px;
  color: ${props => props.theme.colors.dropdown.button.secondary};

  &:hover {
    color: white;
    border-color: white;
  }
`

const AcceptedLabel = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background: ${props => props.theme.colors.label.success};
  padding: 2px 10px;
  border-radius: 4px;
  text-transform: uppercase;
`

const AvatarContainer = styled.div`
  display: flex;
  margin-left: 6px;
  align-items: center;
`

const InvitedByText = styled.div`
  height: 20px;
`

const TickMarkContainer = styled.div`
  display: flex;
  padding-right: 3px;
`

interface InvitationProps {
  invitation: ProjectInvitation
  invitingUserProfile: UserProfileWithAvatar
  acceptInvitation: (invitation: ProjectInvitation) => void
  confirmReject: (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ProjectInvitation
  ) => void
}

export const InvitationDropdownSection: React.FunctionComponent<
  InvitationProps
> = ({ invitation, invitingUserProfile, acceptInvitation, confirmReject }) => (
  <DropdownElement>
    <ProjectNameContainer>
      <DropdownWithNotificationIcon>
        <ProjectNotification color={theme.colors.icon.primary} />
      </DropdownWithNotificationIcon>
      <ButtonsContainer>
        <Title value={invitation.projectTitle || 'Untitled Invitation'} />
        <InvitedBy>
          <InvitedByText>Invited by</InvitedByText>
          <AvatarContainer>
            <Avatar
              size={20}
              src={invitingUserProfile.avatar}
              color={theme.colors.icon.primary}
            />
          </AvatarContainer>
        </InvitedBy>
      </ButtonsContainer>
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
  </DropdownElement>
)

export const PlaceholderTitle = styled(Title)`
  color: ${props => props.theme.colors.title.placeholder};
`

interface ProjectSectionProps {
  project: Partial<Project>
  accepted?: boolean
  handleClose?: React.MouseEventHandler<HTMLElement>
}

export const ProjectDropdownSection: React.FunctionComponent<
  ProjectSectionProps
> = ({ project, accepted, handleClose }) => (
  <DropdownLink
    key={project._id}
    to={`/projects/${project._id}`}
    activeStyle={activeStyle}
    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
      handleClose ? handleClose(event) : null
    }
  >
    <ProjectNameContainer>
      <DropdownIcon>
        <ProjectIcon color={theme.colors.icon.primary} />
      </DropdownIcon>
      {project.title ? (
        <Title value={project.title} />
      ) : (
        <PlaceholderTitle value={'Untitled Project'} />
      )}
    </ProjectNameContainer>
    {accepted && (
      <AcceptedLabel>
        <TickMarkContainer>
          <TickMark />
        </TickMarkContainer>
        Accepted
      </AcceptedLabel>
    )}
  </DropdownLink>
)

interface DropdownSectionProps {
  onClick?: React.MouseEventHandler
  icon: JSX.Element
}

export const DropdownSection: React.FunctionComponent<DropdownSectionProps> = ({
  children,
  onClick,
  icon,
}) => (
  <DropdownElement onClick={onClick}>
    <ProjectNameContainer>
      <DropdownIcon>{icon}</DropdownIcon>
      {children}
    </ProjectNameContainer>
  </DropdownElement>
)

interface AllProjectsSectionProps {
  handleClose?: React.MouseEventHandler<HTMLElement>
}

export const AllProjectsDropdownSection: React.FunctionComponent<
  AllProjectsSectionProps
> = ({ handleClose }) => (
  <DropdownLink
    key={'projects'}
    to={'/projects'}
    exact={true}
    activeStyle={activeStyle}
    onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
      handleClose ? handleClose(event) : null
    }
  >
    <ProjectNameContainer>
      <DropdownIcon>
        <ProjectsList />
      </DropdownIcon>
      View All Projects
    </ProjectNameContainer>
  </DropdownLink>
)
