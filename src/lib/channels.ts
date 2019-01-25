import {
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'

// NOTE: need to wait for projects to sync before we can start syncing collaborators
export const buildCollaboratorChannels = (
  userID: string,
  projects: Project[],
  invitations: ProjectInvitation[]
) => {
  const userIDs: Set<string> = new Set([userID])

  projects.forEach(project => {
    const collaborators = [
      ...project.owners,
      ...project.writers,
      ...project.viewers,
    ]

    collaborators.forEach(userID => {
      userIDs.add(userID)
    })
  })

  invitations.forEach(invitation => {
    userIDs.add(invitation.invitingUserID)
  })

  return [...userIDs].map(userID => `${userID}-read`)
}
