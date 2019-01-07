import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'

interface ProjectInfo extends Partial<Project> {
  collaborators: UserProfile[]
}

export const projectListCompare = (
  a: ProjectInfo | Project,
  b: ProjectInfo | Project
) => {
  // sort untitled projects to the top
  if (!a.title) {
    return b.title ? -1 : Number(b.createdAt) - Number(a.createdAt)
  }

  return (
    String(a.title).localeCompare(String(b.title)) ||
    Number(b.createdAt) - Number(a.createdAt)
  )
}
