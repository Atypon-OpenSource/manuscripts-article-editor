import {
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CollaboratorsData from '../../data/CollaboratorsData'
import InvitationsData from '../../data/InvitationsData'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import { getCurrentUserId } from '../../lib/user'
import MenuDropdown from './MenuDropdown'
import ProjectsMenu from './ProjectsMenu'

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
}

class ProjectsDropdownButton extends React.Component<{}, State> {
  public state: Readonly<State> = {
    handledInvitations: new Set(),
  }

  public render() {
    return (
      <UserData userID={getCurrentUserId()!}>
        {user => (
          <CollaboratorsData>
            {collaborators => (
              <ProjectsData>
                {projects => (
                  <InvitationsData>
                    {invitations => {
                      const invitationsData = this.buildInvitationData(
                        invitations,
                        user,
                        collaborators
                      )

                      return (
                        <MenuDropdown
                          buttonContents={'Projects'}
                          notificationsCount={invitationsData.length}
                          dropdownStyle={{ width: 342, left: 20 }}
                        >
                          <ProjectsMenu
                            invitationsData={invitationsData}
                            projects={projects}
                            removeInvitationData={this.removeInvitationData}
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
}

export default ProjectsDropdownButton
