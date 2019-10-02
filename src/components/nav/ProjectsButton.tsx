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
import React from 'react'
import ContainersInvitationsData from '../../data/ContainersInvitationsData'
import ProjectsData from '../../data/ProjectsData'
import ProjectsInvitationsData from '../../data/ProjectsInvitationsData'
import { TokenActions } from '../../data/TokenData'
import UserData from '../../data/UserData'
import { acceptProjectInvitation, rejectProjectInvitation } from '../../lib/api'
import { buildContainerInvitations } from '../../lib/invitation'
import { getCurrentUserId } from '../../lib/user'
import { styled } from '../../theme/styled-components'
import { InvitationsList } from '../projects/InvitationsList'
import { ProjectsList } from '../projects/ProjectsList'
import { SidebarContent } from '../Sidebar'
import { ProjectsDropdown } from './ProjectsDropdown'
import ProjectsMenu from './ProjectsMenu'

const Container = styled.div`
  font-weight: ${props => props.theme.font.weight.medium};
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
  tokenActions?: TokenActions
}
class ProjectsButton extends React.Component<Props, State> {
  public state: Readonly<State> = {
    handledInvitations: new Set(),
    acceptedInvitations: [],
    rejectedInvitations: [],
    acceptError: null,
    rejectedInvitation: null,
    invitingUserProfile: null,
  }

  public render() {
    const { closeModal, tokenActions } = this.props

    const {
      acceptedInvitations,
      rejectedInvitations,
      acceptError,
      rejectedInvitation,
    } = this.state

    const actions = {
      primary: {
        action: () =>
          this.setState({
            rejectedInvitation: null,
            invitingUserProfile: null,
          }),
        title: 'Cancel',
      },
      secondary: {
        action: () => this.rejectInvitation(rejectedInvitation!),
        title: 'Reject',
        isDestructive: true,
      },
    }
    return (
      <React.Fragment>
        {
          <UserData userID={getCurrentUserId()!}>
            {user => (
              <ProjectsData>
                {(projects, projectsCollection) => (
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
                          ].filter(invitation =>
                            invitation.containerID.startsWith('MPProject')
                          )

                          const invitationsData = this.buildInvitationData(
                            allInvitations,
                            user
                          )

                          const projectsIDs = projects.map(
                            project => project._id
                          )

                          const filteredInvitationsData = invitationsData.filter(
                            invitationData =>
                              projectsIDs.indexOf(
                                invitationData.container._id
                              ) < 0
                          )

                          return !this.props.isDropdown ? (
                            <React.Fragment>
                              <InvitationsList
                                invitationsData={filteredInvitationsData}
                                acceptInvitation={this.acceptInvitation}
                                acceptError={acceptError}
                                confirmReject={this.confirmReject}
                              />
                              <SidebarContent>
                                <ProjectsList
                                  projects={projects}
                                  acceptedInvitations={acceptedInvitations}
                                  deleteProject={(project: Project) => () =>
                                    projectsCollection.delete(project._id)}
                                  saveProjectTitle={(project: Project) => (
                                    title: string
                                  ) =>
                                    projectsCollection.update(project._id, {
                                      title,
                                    })}
                                  closeModal={closeModal}
                                  user={user}
                                  tokenActions={tokenActions!}
                                />
                              </SidebarContent>
                            </React.Fragment>
                          ) : (
                            <ProjectsDropdown
                              notificationsCount={
                                filteredInvitationsData.length
                              }
                            >
                              <ProjectsMenu
                                invitationsData={invitationsData}
                                projects={projects}
                                removeInvitationData={this.removeInvitationData}
                                acceptedInvitations={acceptedInvitations}
                                rejectedInvitations={rejectedInvitations}
                                acceptError={acceptError}
                                acceptInvitation={this.acceptInvitation}
                                confirmReject={this.confirmReject}
                                user={user}
                              />
                            </ProjectsDropdown>
                          )
                        }}
                      </ProjectsInvitationsData>
                    )}
                  </ContainersInvitationsData>
                )}
              </ProjectsData>
            )}
          </UserData>
        }

        {this.state.rejectedInvitation && (
          <Dialog
            isOpen={this.state.rejectedInvitation ? true : false}
            actions={actions}
            category={Category.confirmation}
            header={'Reject Project Invitation'}
            message={
              <div>
                <div>Are you sure you want to reject invitation from</div>
                <br />{' '}
                <Container>
                  {this.state.invitingUserProfile!.bibliographicName.given! +
                    ' ' +
                    this.state.invitingUserProfile!.bibliographicName.family!}
                </Container>
                <Container>
                  ({this.state.invitingUserProfile!.email}
                  )?
                </Container>{' '}
              </div>
            }
          />
        )}
      </React.Fragment>
    )
  }

  private buildInvitationData = (
    invitations: ContainerInvitation[],
    user: UserProfile
  ) => {
    const { handledInvitations } = this.state

    const invitationsData: InvitationData[] = []

    for (const invitation of invitations) {
      const { acceptedAt, invitingUserProfile } = invitation

      if (acceptedAt) continue // ignore accepted invitations

      if (!invitingUserProfile) continue // inviting profile is needed

      if (invitingUserProfile._id === user._id) continue // ignore invitations sent by this user

      if (handledInvitations.has(invitation._id)) continue // ignore handled invitations

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

  private removeInvitationData = (id: string) => {
    const { handledInvitations } = this.state

    handledInvitations.add(id)

    this.setState({ handledInvitations })
  }

  private acceptInvitation = async (invitation: ContainerInvitation) => {
    try {
      await acceptProjectInvitation(invitation._id)

      const acceptedInvitations = this.state.acceptedInvitations.concat(
        invitation.containerID
      )

      this.setState({ acceptedInvitations })

      this.removeInvitationData(invitation._id)
    } catch (error) {
      const errorMessage =
        error && error.response && error.response.status === 400
          ? 'The invitation does not exist, either because it has expired or the project owner uninvited you.'
          : `Service unreachable, please try again later.`

      this.setState({
        acceptError: { invitationId: invitation._id, errorMessage },
      })
    }
  }

  private confirmReject = async (
    invitingUserProfile: UserProfileWithAvatar,
    invitation: ContainerInvitation
  ) => {
    this.setState({
      invitingUserProfile,
      rejectedInvitation: invitation,
    })
  }

  private rejectInvitation = async (invitation: ContainerInvitation) => {
    await rejectProjectInvitation(invitation._id)

    const rejectedInvitations = this.state.rejectedInvitations.concat(
      invitation.containerID
    )

    this.setState({ rejectedInvitations })

    this.removeInvitationData(invitation._id)

    this.setState({
      rejectedInvitation: null,
      invitingUserProfile: null,
    })
  }
}

export default ProjectsButton
