import { timestamp } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { InvitationData } from '../../src/components/nav/ProjectsButton'

export const invitations: ProjectInvitation[] = [
  {
    _id: 'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
    invitedUserEmail: 'lmessi@atypon.com',
    invitedUserName: 'Lionel Messi',
    invitingUserID: 'User|pcoutinho@atypon.com',
    projectID: 'MPProject:2D9BC3CE-D75D-429F-AE8B-3459269785D5',
    projectTitle: 'Breadth First Search Algorithm',
    message: 'message',
    role: 'Writer',
    objectType: 'MPProjectInvitation',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
  {
    _id: 'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f547',
    invitedUserEmail: 'lmessi@atypon.com',
    invitingUserID: 'User|pcoutinho@atypon.com',
    projectID: 'MPProject:C8C7A84A-0927-4240-B83E-F5290C829BDB',
    message: 'message',
    role: 'Writer',
    objectType: 'MPProjectInvitation',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
]

const userProfiles: UserProfile[] = [
  {
    _id: 'ID',
    userID: 'User|pcoutinho@atypon.com',
    bibliographicName: {
      _id: '001',
      objectType: 'MPBibliographicName',
      given: 'Lionel',
      family: 'Messi',
    },
    objectType: 'MPUserProfile',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
]

const projects: Project[] = [
  {
    _id: invitations[0].projectID,
    objectType: 'MPProject',
    owners: [],
    viewers: [],
    writers: [],
    title: invitations[0].projectTitle || 'Untitled Project',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
  {
    _id: invitations[1].projectID,
    objectType: 'MPProject',
    owners: [],
    viewers: [],
    writers: [],
    title: invitations[1].projectTitle || 'Untitled Project',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
]

const invitationsData: InvitationData[] = [
  {
    invitation: invitations[0],
    invitingUserProfile: userProfiles[0],
    project: projects[0],
  },
  {
    invitation: invitations[1],
    invitingUserProfile: userProfiles[0],
    project: projects[1],
  },
]

export default invitationsData
