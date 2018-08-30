import { Project } from '../types/components'

export enum ProjectRole {
  owner = 'Owner',
  writer = 'Writer',
  viewer = 'Viewer',
}

export const isOwner = (project: Project, userID: string) =>
  project.owners.includes(userID)

export const isWriter = (project: Project, userID: string) =>
  project.writers.includes(userID)

export const isViewer = (project: Project, userID: string) =>
  project.viewers.includes(userID)

export const getUserRole = (project: Project, userID: string) => {
  if (isOwner(project, userID)) {
    return ProjectRole.owner
  }

  if (isWriter(project, userID)) {
    return ProjectRole.writer
  }

  if (isViewer(project, userID)) {
    return ProjectRole.viewer
  }

  return null
}
