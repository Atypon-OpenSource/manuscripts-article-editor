import {
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import InvitationsData from '../../data/InvitationsData'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import UsersData from '../../data/UsersData'
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
          <UsersData>
            {users => (
              <ProjectsData>
                {projects => (
                  <InvitationsData>
                    {invitations => {
                      const invitationsData = this.buildInvitationData(
                        invitations,
                        user,
                        users
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
                          />
                        </MenuDropdown>
                      )
                    }}
                  </InvitationsData>
                )}
              </ProjectsData>
            )}
          </UsersData>
        )}
      </UserData>
    )
  }

  private buildInvitationData = (
    invitations: ProjectInvitation[],
    user: UserProfile,
    users: Map<string, UserProfile>
  ) => {
    const { handledInvitations } = this.state

    const invitationsData: InvitationData[] = []

    for (const invitation of invitations) {
      if (invitation.acceptedAt) continue // ignore accepted invitations
      if (invitation.invitingUserID === user.userID) continue // ignore invitee invitations
      if (handledInvitations.has(invitation._id)) continue // ignore handled invitations

      const invitingUserProfile = users.get(invitation.invitingUserID)
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
