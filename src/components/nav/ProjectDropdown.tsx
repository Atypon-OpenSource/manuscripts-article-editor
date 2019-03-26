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

import ProjectIcon from '@manuscripts/assets/react/ProjectIcon'
import ProjectsList from '@manuscripts/assets/react/ProjectsList'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import {
  Avatar,
  Button,
  PrimaryButton,
  ProjectNotificationIcon,
  TickMarkIcon,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'
import {
  AddIconContainer,
  AddIconHover,
  RegularAddIcon,
} from '../projects/ProjectsListPlaceholder'
import {
  DropdownElement,
  DropdownLink,
  InvitedBy,
  PlaceholderTitle,
} from './Dropdown'

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
  padding-left: 7px;
`

const TextContainer = styled.div`
  padding-left: 10px;
  padding-bottom: 2px;

  &:hover {
    text-decoration: underline;
  }
`

const ProjectNameContainer = styled.div`
  display: flex;
  align-items: center;
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
        <ProjectNotificationIcon color={theme.colors.icon.primary} />
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
          <TickMarkIcon />
        </TickMarkContainer>
        Accepted
      </AcceptedLabel>
    )}
  </DropdownLink>
)

interface DropdownSectionProps {
  onClick?: React.MouseEventHandler
}

export const DropdownSection: React.FunctionComponent<DropdownSectionProps> = ({
  children,
  onClick,
}) => (
  <DropdownElement onClick={onClick}>
    <AddIconContainer>
      <RegularAddIcon width={24} height={26} />
      <AddIconHover width={24} height={26} />
      <TextContainer>{children}</TextContainer>
    </AddIconContainer>
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
        <ProjectsList width={24} height={26} />
      </DropdownIcon>
      View All Projects
    </ProjectNameContainer>
  </DropdownLink>
)
