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
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React, { useState } from 'react'
import styled from 'styled-components'

import { acceptProjectInvitation, rejectProjectInvitation } from '../../lib/api'
import {
  buildContainerInvitations,
  findLeastLimitingInvitation,
  groupInvitations,
} from '../../lib/invitation'
import { trackEvent } from '../../lib/tracking'
import { useStore } from '../../store'
import { acceptInvitationErrorMessage } from '../Messages'
import { InvitationsList } from '../projects/InvitationsList'
import { ProjectsList } from '../projects/ProjectsList'
import { SidebarContent } from '../Sidebar'
import { ProjectsDropdown } from './ProjectsDropdown'
import ProjectsMenu from './ProjectsMenu'

const Container = styled.div`
  font-weight: ${(props) => props.theme.font.weight.medium};
`
const StyledSidebarContent = styled(SidebarContent)`
  overflow: auto;
  padding: 0;

  @media (min-width: ${(props) => props.theme.grid.tablet}px) {
    padding-right: ${(props) => props.theme.grid.unit * 15}px;
  }
`
export interface InvitationDataContainer {
  _id: string
  title?: string
}

export interface InvitationData {
  invitation: ContainerInvitation
  invitingUserProfile: UserProfile
  container: InvitationDataContainer
}

interface State {
  handledInvitations: Set<string>
  acceptedInvitations: string[]
  rejectedInvitations: string[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
  rejectedInvitation: ContainerInvitation | null
  invitingUserProfile: UserProfileWithAvatar | null
}

interface Props {
  isDropdown: boolean
  closeModal?: () => void
}
const ProjectsButton: React.FC<Props> = (props) => {
  const [
    {
      user,
      projects,
      deleteProject,
      updateProject,
      invitations,
      projectInvitations,
    },
  ] = useStore((store) => ({
    user: store.user,
    projects: store.projects,
    deleteProject: store.deleteProject,
    updateProject: store.updateProject,
    invitations: store.invitations || [],
    projectInvitations: store.projectInvitations || [],
  }))
  const [state, setState] = useState<State>({
    handledInvitations: new Set(),
    acceptedInvitations: [],
    rejectedInvitations: [],
    acceptError: null,
    rejectedInvitation: null,
    invitingUserProfile: null,
  })

  const buildInvitationData = (
    invitations: ContainerInvitation[],
    user: UserProfile
  ) => {
    const { handledInvitations } = state

    const invitationsData: InvitationData[] = []

    for (const invitation of invitations) {
      const { acceptedAt, invitingUserProfile } = invitation

      if (acceptedAt) {
        continue
      } // ignore accepted invitations

      if (!invitingUserProfile) {
        continue
      } // inviting profile is needed

      if (invitingUserProfile._id === user._id) {
        continue
      } // ignore invitations sent by this user

      if (handledInvitations.has(invitation._id)) {
        continue
      } // ignore handled invitations

      invitationsData.push({
        invitation,
        invitingUserProfile,
        container: {
          _id: invitation.containerID,
          title: invitation.containerTitle,
        },
      })
    }

    return invitationsData
  }

  const removeInvitationData = (id: string) => {
    const { handledInvitations } = state

    handledInvitations.add(id)

    setState((state) => ({ ...state, handledInvitations }))
  }

  const acceptInvitation = async (invitation: ContainerInvitation) => {
    await acceptProjectInvitation(invitation._id).then(
      ({ data }) => {
        const acceptedInvitations = state.acceptedInvitations.concat(
          invitation.containerID
        )

        setState((state) => ({ ...state, acceptedInvitations }))

        removeInvitationData(invitation._id)

        trackEvent({
          category: 'Invitations',
          action: 'Accept',
          label: `projectID=${data.containerID}`,
        })
      },
      (error) => {
        const errorMessage = error.response
          ? acceptInvitationErrorMessage(error.response.status)
          : ''
        setState((state) => ({
          ...state,
          acceptError: { invitationId: invitation._id, errorMessage },
        }))
      }
    )
  }

  const confirmReject = async (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ContainerInvitation
  ) => {
    setState((state) => ({
      ...state,
      invitingUserProfile,
      rejectedInvitation: invitation,
    }))
  }
  const rejectInvitation = async (invitation: ContainerInvitation) => {
    await rejectProjectInvitation(invitation._id)

    const rejectedInvitations = state.rejectedInvitations.concat(
      invitation.containerID
    )

    setState((state) => ({ ...state, rejectedInvitations }))

    removeInvitationData(invitation._id)

    setState((state) => ({
      ...state,
      rejectedInvitation: null,
      invitingUserProfile: null,
    }))
  }

  const { closeModal } = props

  const {
    acceptedInvitations,
    rejectedInvitations,
    acceptError,
    rejectedInvitation,
  } = state

  const actions = {
    primary: {
      action: () => rejectInvitation(rejectedInvitation!),
      title: 'Reject',
      isDestructive: true,
    },
    secondary: {
      action: () =>
        setState((state) => ({
          ...state,
          rejectedInvitation: null,
          invitingUserProfile: null,
        })),
      title: 'Cancel',
    },
  }

  const containerInvitations = buildContainerInvitations(projectInvitations)

  const allInvitations: ContainerInvitation[] = [
    ...invitations,
    ...containerInvitations,
  ].filter((invitation) => invitation.containerID.startsWith('MPProject'))

  const invitationsByContainer = groupInvitations(allInvitations, 'Container')

  const leastLimitingInvitations: ContainerInvitation[] = []

  for (const invitations of Object.values(invitationsByContainer)) {
    leastLimitingInvitations.push(findLeastLimitingInvitation(invitations))
  }

  const invitationsData = buildInvitationData(leastLimitingInvitations, user)

  const projectsIDs = projects.map((project) => project._id)

  const filteredInvitationsData = invitationsData.filter(
    (invitationData) => projectsIDs.indexOf(invitationData.container._id) < 0
  )

  return (
    <React.Fragment>
      {!props.isDropdown ? (
        <React.Fragment>
          <StyledSidebarContent>
            <InvitationsList
              invitationsData={filteredInvitationsData}
              acceptInvitation={acceptInvitation}
              acceptError={acceptError}
              confirmReject={confirmReject}
            />
            <ProjectsList
              projects={projects}
              acceptedInvitations={acceptedInvitations}
              deleteProject={(project) => () => deleteProject(project._id)}
              saveProjectTitle={(project: Project) => (title: string) =>
                updateProject(project._id, { title })}
              closeModal={closeModal}
              user={user}
            />
          </StyledSidebarContent>
        </React.Fragment>
      ) : (
        <ProjectsDropdown notificationsCount={filteredInvitationsData.length}>
          <ProjectsMenu
            invitationsData={filteredInvitationsData}
            projects={projects}
            removeInvitationData={removeInvitationData}
            acceptedInvitations={acceptedInvitations}
            rejectedInvitations={rejectedInvitations}
            acceptError={acceptError}
            acceptInvitation={acceptInvitation}
            confirmReject={confirmReject}
            user={user}
          />
        </ProjectsDropdown>
      )}
      {state.rejectedInvitation && (
        <Dialog
          isOpen={state.rejectedInvitation ? true : false}
          actions={actions}
          category={Category.confirmation}
          header={'Reject Project Invitation'}
          message={
            <div>
              <div>Are you sure you want to reject invitation from</div>
              <br />{' '}
              <Container>
                {state.invitingUserProfile!.bibliographicName.given! +
                  ' ' +
                  state.invitingUserProfile!.bibliographicName.family!}
              </Container>
              <Container>
                ({state.invitingUserProfile!.email}
                )?
              </Container>{' '}
            </div>
          }
        />
      )}
    </React.Fragment>
  )
}

export default ProjectsButton
