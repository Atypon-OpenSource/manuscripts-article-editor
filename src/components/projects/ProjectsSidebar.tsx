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
  ContainerInvitation,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import styled from 'styled-components'

import config from '../../config'
import { buildContainerInvitations } from '../../lib/invitation'
import { useStore } from '../../store'
import { AddButton } from '../AddButton'
import ImportContainer, { ImportProps } from '../ImportContainer'
import { useModal } from '../ModalHookableProvider'
import { ModalProps, withModal } from '../ModalProvider'
import ProjectsButton from '../nav/ProjectsButton'
import { Sidebar, SidebarHeader } from '../Sidebar'
import TemplateSelector from '../templates/TemplateSelector'
import { ProjectsListPlaceholder } from './ProjectsListPlaceholder'

const Container = styled(Sidebar)`
  background-color: ${(props) => props.theme.colors.background.primary};
  overflow: auto;
`

const Header = styled(SidebarHeader)`
  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`

const SidebarAction = styled.div`
  margin: ${(props) => props.theme.grid.unit * 3}px;
  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 4}px;
  }
`

const ProjectsContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${(props) => props.theme.grid.unit * 5}px
    ${(props) => props.theme.grid.unit * 15}px;
  padding-right: 0;
  width: 100%;

  @media (max-width: ${(props) => props.theme.grid.tablet - 1}px) {
    padding: unset;
  }
`

interface Props {
  closeModal?: () => void
  importManuscript?: (models: Model[]) => Promise<void>
}

const ProjectsSidebar: React.FunctionComponent<ModalProps & Props> = (
  props
) => {
  const [{ invitations, projectsInvitations, projects, user }] = useStore(
    (store) => ({
      invitations: store.invitations || [],
      projectsInvitations: store.projectsInvitations,
      projects: store.projects,
      user: store.user,
    })
  )

  const { addModal } = useModal()

  const openTemplateSelector = (
    props: ModalProps,
    user: UserProfileWithAvatar
  ) => () => {
    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector user={user} handleComplete={handleClose} />
    ))
  }

  const containerInvitations: ContainerInvitation[] = buildContainerInvitations(
    projectsInvitations
  )

  const allInvitations: ContainerInvitation[] = [
    ...invitations,
    ...containerInvitations,
  ]

  const invitationReceived = allInvitations.filter(
    (invitation) =>
      invitation.invitedUserEmail === user.email &&
      !invitation.acceptedAt &&
      invitation.containerID.startsWith('MPProject')
  )
  return projects.length || invitationReceived.length ? (
    <Container id={'projects-sidebar'}>
      <ProjectsContainer>
        <Header title={<span className={'sidebar-title'}>Projects</span>} />
        {!config.leanWorkflow.enabled && (
          <SidebarAction>
            <AddButton
              action={openTemplateSelector(props, user)}
              size={'medium'}
              title={'New Project'}
            />
          </SidebarAction>
        )}

        <ProjectsButton isDropdown={false} closeModal={props.closeModal} />
      </ProjectsContainer>
    </Container>
  ) : (
    <ImportContainer
      importManuscript={props.importManuscript!}
      render={({ handleClick, isDragAccept }: ImportProps) => (
        <ProjectsListPlaceholder
          handleClick={handleClick}
          openTemplateSelector={openTemplateSelector(props, user)}
          isDragAccept={isDragAccept}
        />
      )}
    />
  )
}

export default withModal(ProjectsSidebar)
