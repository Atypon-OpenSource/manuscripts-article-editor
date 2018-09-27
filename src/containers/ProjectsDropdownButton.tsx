import React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import MenuDropdown from '../components/MenuDropdown'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { PROJECT_INVITATION, USER_PROFILE } from '../transformer/object-types'
import {
  Attachments,
  ComponentAttachment,
  ProjectInvitation,
  UserProfile,
} from '../types/components'
import { ProjectInvitationDocument } from '../types/project'
import ProjectsMenu from './ProjectsMenu'

export interface InvitationDataProject {
  id: string
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

const getUserProfileFromDoc = async (
  doc: RxDocument<UserProfile & Attachments>
): Promise<UserProfile & ComponentAttachment> => {
  const {
    _rev,
    _deleted,
    updatedAt,
    createdAt,
    sessionID,
    ...data
  } = doc.toJSON()

  if (doc._attachments) {
    const attachments = await doc.allAttachments()
    const blob = await attachments[0].getData()
    data.image = window.URL.createObjectURL(blob)
  }

  return data
}

class ProjectsDropdownButton extends React.Component<
  UserProps & ComponentsProps,
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
    return this.props.components.collection as RxCollection<{}>
  }

  // TODO: move this to a data provider that owns the map of user profiles
  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: USER_PROFILE })
      .$.subscribe(
        async (docs: Array<RxDocument<UserProfile & Attachments>>) => {
          const userMap: Map<string, UserProfile> = new Map()

          await Promise.all(
            docs.map(async doc => {
              const user = await getUserProfileFromDoc(doc)
              userMap.set(user.userID, user)
            })
          )

          this.setState({ userMap })
        }
      )

  private loadInvitations = () =>
    this.getCollection()
      .find({
        objectType: PROJECT_INVITATION,
      })
      .$.subscribe(async (docs: ProjectInvitationDocument[]) => {
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
              id: invitation.projectID,
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
        invitationData => invitationData.invitation.id !== id
      ),
    })
  }
}

export default withComponents(withUser(ProjectsDropdownButton))
