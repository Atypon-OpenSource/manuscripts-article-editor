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
  ContainerInvitation,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import ContainersInvitationsData from '../../data/ContainersInvitationsData'
import ProjectsData from '../../data/ProjectsData'
import ProjectsInvitationsData from '../../data/ProjectsInvitationsData'
import { TokenActions } from '../../data/TokenData'
import UserData from '../../data/UserData'
import { buildContainerInvitations } from '../../lib/invitation'
import { getCurrentUserId } from '../../lib/user'
import { styled } from '../../theme/styled-components'
import ImportContainer, { ImportProps } from '../ImportContainer'
import { ModalProps, withModal } from '../ModalProvider'
import ProjectsButton from '../nav/ProjectsButton'
import { Sidebar, SidebarHeader, SidebarTitle } from '../Sidebar'
import TemplateSelector from '../templates/TemplateSelector'
import {
  AddIconContainer,
  AddIconHover,
  ProjectsListPlaceholder,
  RegularAddIcon,
} from './ProjectsListPlaceholder'

const Container = styled(Sidebar)`
  background: white;
`

const Header = styled(SidebarHeader)`
  @media (max-width: 450px) {
    margin-left: 7px;
  }
`

const SidebarActionTitle = styled.span`
  display: flex;
  align-items: center;
  padding-bottom: 2px;
  padding-left: 10px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.2px;
  color: ${props => props.theme.colors.sidebar.text.primary};
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover ${SidebarActionTitle} {
    color: #000;
  }

  &:focus {
    outline: none;
  }
`

const SidebarAction = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  @media (max-width: 450px) {
    margin-left: 17px;
  }
`

const ProjectsContainer = styled.div`
  padding: 20px 60px;

  @media (max-width: 450px) {
    padding: unset;
  }
`

const openTemplateSelector = (
  props: ModalProps,
  user: UserProfileWithAvatar
) => () => {
  props.addModal('template-selector', ({ handleClose }) => (
    <TemplateSelector user={user} handleComplete={handleClose} />
  ))
}

interface Props {
  closeModal?: () => void
  importManuscript?: (models: Model[]) => Promise<void>
  tokenActions: TokenActions
}

const ProjectsSidebar: React.FunctionComponent<ModalProps & Props> = props => (
  <UserData userID={getCurrentUserId()!}>
    {user => (
      <ProjectsData>
        {projects => (
          <ContainersInvitationsData>
            {invitations => (
              <ProjectsInvitationsData>
                {projectsInvitations => {
                  const containerInvitations: ContainerInvitation[] = buildContainerInvitations(
                    projectsInvitations
                  )

                  const allInvitations: ContainerInvitation[] = [
                    ...invitations,
                    ...containerInvitations,
                  ]

                  const invitationReceived = allInvitations.filter(
                    invitation =>
                      invitation.invitedUserEmail === user.email &&
                      !invitation.acceptedAt &&
                      invitation.containerID.startsWith('MPProject')
                  )

                  return projects.length || invitationReceived.length ? (
                    <Container id={'projects-sidebar'}>
                      <ProjectsContainer>
                        <Header>
                          <SidebarTitle className={'sidebar-title'}>
                            Projects
                          </SidebarTitle>
                        </Header>
                        <SidebarAction>
                          <AddButton
                            onClick={openTemplateSelector(props, user)}
                            id={'create-project'}
                          >
                            <AddIconContainer>
                              <RegularAddIcon />
                              <AddIconHover />
                              <SidebarActionTitle>
                                New Project
                              </SidebarActionTitle>
                            </AddIconContainer>
                          </AddButton>
                        </SidebarAction>
                        <ProjectsButton
                          isDropdown={false}
                          closeModal={props.closeModal}
                          tokenActions={props.tokenActions}
                        />
                      </ProjectsContainer>
                    </Container>
                  ) : (
                    <ImportContainer
                      importManuscript={props.importManuscript!}
                      render={({ handleClick, isDragAccept }: ImportProps) => (
                        <ProjectsListPlaceholder
                          handleClick={handleClick}
                          openTemplateSelector={openTemplateSelector(
                            props,
                            user
                          )}
                          isDragAccept={isDragAccept}
                        />
                      )}
                    />
                  )
                }}
              </ProjectsInvitationsData>
            )}
          </ContainersInvitationsData>
        )}
      </ProjectsData>
    )}
  </UserData>
)

export default withModal<Props>(ProjectsSidebar)
