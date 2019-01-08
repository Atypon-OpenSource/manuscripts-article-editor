import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { Project } from '@manuscripts/manuscripts-json-schema'

export const buildCollaborators = (
  project: Project,
  users: Map<string, UserProfileWithAvatar>
): UserProfileWithAvatar[] => {
  const getCollaborator = (id: string) => users.get(id)!

  return [
    ...project.owners.map(getCollaborator),
    ...project.writers.map(getCollaborator),
    ...project.viewers.map(getCollaborator),
  ].filter(_ => _)
}
