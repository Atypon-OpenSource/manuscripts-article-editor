import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor/dist/types'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CollaboratorsData from '../../data/CollaboratorsData'
import InvitationsData from '../../data/InvitationsData'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import { acceptProjectInvitation, rejectProjectInvitation } from '../../lib/api'
import { getCurrentUserId } from '../../lib/user'
import { styled } from '../../theme/styled-components'
import { Category, Dialog } from '../Dialog'
import { InvitationsList } from '../projects/InvitationsList'
import { ProjectsList } from '../projects/ProjectsList'
import { SidebarContent } from '../Sidebar'
import MenuDropdown from './MenuDropdown'
import ProjectsMenu from './ProjectsMenu'

const Container = styled.div`
  font-weight: 500;
`
export interface InvitationDataProject {
  _id: string
  title?: string
}

export interface InvitationData {
  invitation: ProjectInvitation
  invitingUserProfile: UserProfile
  project: InvitationDataProject
}

interface State {
  handledInvitations: Set<string>
  acceptedInvitations: string[]
  rejectedInvitations: string[]
  acceptError: {
    invitationId: string
    errorMessage: string
  } | null
  rejectedInvitation: ProjectInvitation | null
  invitingUserProfile: UserProfileWithAvatar | null
}

interface Props {
  isDropdown: boolean
  closeModal?: () => void
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
    const { closeModal } = this.props

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
              <CollaboratorsData>
                {collaborators => (
                  <ProjectsData>
                    {(projects, projectsCollection) => (
                      <InvitationsData>
                        {invitations => {
                          const invitationsData = this.buildInvitationData(
                            invitations,
                            user,
                            collaborators
                          )

                          const projectsIDs = projects.map(
                            project => project._id
                          )

                          const filteredInvitationsData = invitationsData.filter(
                            invitationData =>
                              projectsIDs.indexOf(invitationData.project._id) <
                              0
                          )

                          return !this.props.isDropdown ? (
                            <div>
                              <InvitationsList
                                invitationsData={filteredInvitationsData}
                                acceptInvitation={this.acceptInvitation}
                                acceptError={acceptError}
                                confirmReject={this.confirmReject}
                              />
                              <SidebarContent>
                                <ProjectsList
                                  projects={projects}
                                  collaborators={collaborators}
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
                                />
                              </SidebarContent>
                            </div>
                          ) : (
                            <MenuDropdown
                              buttonContents={'Projects'}
                              notificationsCount={invitationsData.length}
                              dropdownStyle={{ width: 342, left: 20 }}
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
                            </MenuDropdown>
                          )
                        }}
                      </InvitationsData>
                    )}
                  </ProjectsData>
                )}
              </CollaboratorsData>
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
    invitations: ProjectInvitation[],
    user: UserProfile,
    collaborators: Map<string, UserProfile>
  ) => {
    const { handledInvitations } = this.state

    const invitationsData: InvitationData[] = []

    for (const invitation of invitations) {
      if (invitation.acceptedAt) continue // ignore accepted invitations
      if (invitation.invitingUserID === user.userID) continue // ignore invitee invitations
      if (handledInvitations.has(invitation._id)) continue // ignore handled invitations

      const invitingUserProfile = collaborators.get(invitation.invitingUserID)
      if (!invitingUserProfile) continue // ignore missing invitee

      invitationsData.push({
        invitation,
        invitingUserProfile,
        project: {
          _id: invitation.projectID,
          title: invitation.projectTitle,
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

  private acceptInvitation = async (invitation: ProjectInvitation) => {
    try {
      await acceptProjectInvitation(invitation._id)

      const acceptedInvitations = this.state.acceptedInvitations.concat(
        invitation.projectID
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
    invitation: ProjectInvitation
  ) => {
    this.setState({
      invitingUserProfile,
      rejectedInvitation: invitation,
    })
  }

  private rejectInvitation = async (invitation: ProjectInvitation) => {
    await rejectProjectInvitation(invitation._id)

    const rejectedInvitations = this.state.rejectedInvitations.concat(
      invitation.projectID
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
