import React from 'react'
import { dustyGrey, manuscriptsBlue } from '../../colors'
import Title from '../../editor/title/Title'
import ProjectIcon from '../../icons/project'
import ProjectNotification from '../../icons/project-notification'
import ProjectsList from '../../icons/projects-list'
import TickMark from '../../icons/tick-mark'
import { styled } from '../../theme'
import { Project, ProjectInvitation, UserProfile } from '../../types/models'
import { Avatar } from '../Avatar'
import { Button, PrimaryButton } from '../Button'
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
  color: ${dustyGrey};
  clear: both;
  margin-top: 6px;
`

const AcceptButton = styled(PrimaryButton)`
  font-size: 14px;
  font-weight: 500;
  background-color: ${manuscriptsBlue};
  padding: 0 8px;

  &:hover {
    color: ${manuscriptsBlue};
    border-color: ${manuscriptsBlue};
  }
`

const RejectButton = styled(Button)`
  font-size: 14px;
  font-weight: 500;
  padding: 0 8px;
  color: ${dustyGrey};

  &:hover {
    color: ${manuscriptsBlue};
    border-color: ${manuscriptsBlue};
  }
`

const AcceptedLabel = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background: #80be86;
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
  invitingUserProfile: UserProfile
  acceptInvitation: (invitation: ProjectInvitation) => void
  rejectInvitation: (invitation: ProjectInvitation) => void
}

export const InvitationDropdownSection: React.SFC<InvitationProps> = ({
  invitation,
  invitingUserProfile,
  acceptInvitation,
  rejectInvitation,
}) => (
  <DropdownElement>
    <ProjectNameContainer>
      <DropdownWithNotificationIcon>
        <ProjectNotification color={'#7fb5d5'} />
      </DropdownWithNotificationIcon>
      <ButtonsContainer>
        <Title value={invitation.projectTitle || 'Untitled Invitation'} />
        <InvitedBy>
          <InvitedByText>Invited by</InvitedByText>
          <AvatarContainer>
            <Avatar
              size={20}
              src={invitingUserProfile.avatar}
              color={'#7fb5d5'}
            />
          </AvatarContainer>
        </InvitedBy>
      </ButtonsContainer>
    </ProjectNameContainer>
    <ButtonsContainer>
      <AcceptButton onClick={() => acceptInvitation(invitation)}>
        Accept
      </AcceptButton>
      <RejectButton onClick={() => rejectInvitation(invitation)}>
        Reject
      </RejectButton>
    </ButtonsContainer>
  </DropdownElement>
)

const PlaceholderTitle = styled(Title)`
  color: ${dustyGrey};

  &:hover {
    color: white;
  }
`

interface ProjectSectionProps {
  project: Partial<Project>
  accepted?: boolean
  handleClose?: React.MouseEventHandler<HTMLElement>
}

export const ProjectDropdownSection: React.SFC<ProjectSectionProps> = ({
  project,
  accepted,
  handleClose,
}) => (
  <DropdownLink
    key={project._id}
    to={`/projects/${project._id}`}
    activeStyle={activeStyle}
    onClick={event => (handleClose ? handleClose(event) : null)}
  >
    <ProjectNameContainer>
      <DropdownIcon>
        <ProjectIcon color={'#7fb5d5'} />
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

export const DropdownSection: React.SFC<DropdownSectionProps> = ({
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

export const AllProjectsDropdownSection: React.SFC<AllProjectsSectionProps> = ({
  handleClose,
}) => (
  <DropdownLink
    key={'projects'}
    to={'/projects'}
    exact={true}
    activeStyle={activeStyle}
    onClick={event => (handleClose ? handleClose(event) : null)}
  >
    <ProjectNameContainer>
      <DropdownIcon>
        <ProjectsList />
      </DropdownIcon>
      {'View all projects'}
    </ProjectNameContainer>
  </DropdownLink>
)
