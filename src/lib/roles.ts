/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { Contributor, Project } from '@manuscripts/manuscripts-json-schema'

export enum ContributorRole {
  author = 'author',
}

export enum ProjectRole {
  owner = 'Owner',
  writer = 'Writer',
  viewer = 'Viewer',
}

export const hasRole = (role: ContributorRole) => (contributor: Contributor) =>
  contributor.role === role

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

export const canWrite = (project: Project, userID: string) => {
  return isOwner(project, userID) || isWriter(project, userID)
}
