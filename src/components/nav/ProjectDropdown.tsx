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

import ProjectIcon from '@manuscripts/assets/react/ProjectIcon'
import ProjectsList from '@manuscripts/assets/react/ProjectsList'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  ContainerInvitation,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import {
  Avatar,
  PrimaryButton,
  ProjectNotificationIcon,
  SecondaryButton,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import styled from 'styled-components'

import { theme } from '../../theme/theme'
import AcceptedLabel from '../AcceptedLabel'
import { AddButton } from '../AddButton'
import {
  DropdownElement,
  DropdownLink,
  InvitedBy,
  PlaceholderTitle,
} from './Dropdown'

const activeStyle = {
  fontWeight: 600,
}

const ActionContainer = styled.div`
  padding: ${(props) => props.theme.grid.unit * 3}px;
`

const DropdownIcon = styled.div`
  display: flex;
  padding-right: ${(props) => props.theme.grid.unit * 3}px;
`

const DropdownWithNotificationIcon = styled.div`
  display: flex;
  padding-right: ${(props) => props.theme.grid.unit}px;
`

const ButtonsContainer = styled.div`
  display: grid;
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`

const ProjectNameContainer = styled.div`
  display: flex;
  align-items: center;
`

const AcceptButton = styled(PrimaryButton)`
  line-height: 1;
  font-size: ${(props) => props.theme.font.size.normal};
  margin-bottom: 4px;
`

const RejectButton = styled(SecondaryButton)`
  line-height: 1;
  font-size: ${(props) => props.theme.font.size.normal};
`

const AvatarContainer = styled.div`
  display: flex;
  margin-left: 6px;
  align-items: center;
`

const InvitedByText = styled.div`
  height: 20px;
`

interface InvitationProps {
  invitation: ContainerInvitation
  invitingUserProfile: UserProfileWithAvatar
  acceptInvitation: (invitation: ContainerInvitation) => void
  confirmReject: (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ContainerInvitation
  ) => void
}

export const InvitationDropdownSection: React.FunctionComponent<InvitationProps> = ({
  invitation,
  invitingUserProfile,
  acceptInvitation,
  confirmReject,
}) => (
  <DropdownElement>
    <ProjectNameContainer>
      <DropdownWithNotificationIcon>
        <ProjectNotificationIcon color={theme.colors.brand.default} />
      </DropdownWithNotificationIcon>
      <ButtonsContainer>
        <Title value={invitation.containerTitle || 'Untitled Invitation'} />
        <InvitedBy>
          <InvitedByText>Invited by</InvitedByText>
          <AvatarContainer>
            <Avatar
              size={20}
              src={invitingUserProfile.avatar}
              color={theme.colors.brand.default}
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

export const ProjectDropdownSection: React.FunctionComponent<ProjectSectionProps> = ({
  project,
  accepted,
  handleClose,
}) => (
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
        <ProjectIcon color={theme.colors.brand.default} />
      </DropdownIcon>
      {project.title ? (
        <Title value={project.title} />
      ) : (
        <PlaceholderTitle value={'Untitled Project'} />
      )}
    </ProjectNameContainer>
    {accepted && <AcceptedLabel backgroundColor={theme.colors.brand.default} />}
  </DropdownLink>
)

interface DropdownSectionProps {
  onClick: React.MouseEventHandler
}

export const DropdownSection: React.FunctionComponent<DropdownSectionProps> = ({
  children,
  onClick,
}) => (
  <ActionContainer>
    <AddButton action={onClick} size={'default'} title={children} />
  </ActionContainer>
)

interface AllProjectsSectionProps {
  handleClose?: React.MouseEventHandler<HTMLElement>
}

export const AllProjectsDropdownSection: React.FunctionComponent<AllProjectsSectionProps> = ({
  handleClose,
}) => (
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
