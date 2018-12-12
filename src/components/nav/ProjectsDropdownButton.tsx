import {
  ObjectTypes,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { buildUserMap } from '../../lib/data'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
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
  invitationsData: InvitationData[] | null
  userMap: Map<string, UserProfile>
}

class ProjectsDropdownButton extends React.Component<
  UserProps & ModelsProps,
  State
> {
  public state: Readonly<State> = {
    invitationsData: null,
    userMap: new Map(),
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    this.subs.push(this.loadUserMap())
    this.subs.push(this.loadInvitations())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { invitationsData } = this.state

    if (invitationsData === null) {
      return null
    }

    return (
      <MenuDropdown
        buttonContents={'Projects'}
        notificationsCount={invitationsData.length}
        dropdownStyle={{ width: 342, left: 20 }}
      >
        <ProjectsMenu
          invitationsData={invitationsData}
          removeInvitationData={this.removeInvitationData}
        />
      </MenuDropdown>
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  // TODO: move this to a data provider that owns the map of user profiles
  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: ObjectTypes.UserProfile })
      .$.subscribe(async (docs: Array<RxDocument<UserProfile>>) => {
        this.setState({
          userMap: await buildUserMap(docs),
        })
      })

  private loadInvitations = () =>
    this.getCollection()
      .find({
        objectType: ObjectTypes.ProjectInvitation,
      })
      .$.subscribe(async (docs: Array<RxDocument<ProjectInvitation>>) => {
        const user = this.props.user.data!
        const { userMap } = this.state

        const invitations = docs
          .map(doc => doc.toJSON())
          .filter(
            invitation =>
              invitation.invitingUserID !== user.userID &&
              !invitation.acceptedAt
          )

        const invitationsData: InvitationData[] = []

        for (const invitation of invitations) {
          const invitingUserProfile = userMap.get(invitation.invitingUserID)

          if (!invitingUserProfile) continue

          invitationsData.push({
            invitation,
            invitingUserProfile,
            project: {
              _id: invitation.projectID,
              title: invitation.projectTitle,
            },
          })
        }

        this.setState({
          invitationsData,
        })
      })

  private removeInvitationData = (id: string) => {
    this.setState({
      invitationsData: this.state.invitationsData!.filter(
        invitationData => invitationData.invitation._id !== id
      ),
    })
  }
}

export default withModels(withUser(ProjectsDropdownButton))
