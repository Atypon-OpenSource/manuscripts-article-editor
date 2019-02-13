/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Project } from '@manuscripts/manuscripts-json-schema'

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

export enum ContributorRole {
  author = 'author',
}
