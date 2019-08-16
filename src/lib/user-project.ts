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

import { Build, generateID, timestamp } from '@manuscripts/manuscript-transform'
import {
  ObjectTypes,
  Project,
  UserProject,
} from '@manuscripts/manuscripts-json-schema'
import deviceID from './device-id'

export interface RecentProject {
  projectID: string
  manuscriptID: string
  projectTitle?: string
  sectionID?: string
}

export const buildUserProject = (
  userID: string,
  projectID: string,
  manuscriptID: string,
  deviceID: string,
  sectionID?: string
): Build<UserProject> => ({
  _id: generateID(ObjectTypes.UserProject),
  objectType: ObjectTypes.UserProject,
  userID,
  projectID,
  lastOpened: {
    [deviceID]: {
      timestamp: timestamp(),
      manuscriptID,
      sectionID,
    },
  },
})

const compareTimestamp = (deviceID: string) => (
  a: UserProject,
  b: UserProject
) => {
  if (a.lastOpened[deviceID].timestamp < b.lastOpened[deviceID].timestamp) {
    return 1
  } else if (
    a.lastOpened[deviceID].timestamp > b.lastOpened[deviceID].timestamp
  ) {
    return -1
  } else return 0
}

export const buildRecentProjects = (
  projectID: string,
  userProjects: UserProject[],
  projects: Project[],
  numberOfProjects: number = 5
): RecentProject[] => {
  const projectsMap = new Map<string, Project>()

  projects.forEach(project => {
    projectsMap.set(project._id, project)
  })

  return userProjects
    .filter(
      userProject =>
        projectID !== userProject.projectID &&
        userProject.lastOpened[deviceID] &&
        projectsMap.get(userProject.projectID)
    )
    .sort(compareTimestamp(deviceID))
    .splice(0, numberOfProjects)
    .map(({ projectID, lastOpened }) => ({
      projectID,
      projectTitle: projectsMap.get(projectID)!.title,
      manuscriptID: lastOpened[deviceID].manuscriptID,
      sectionID: lastOpened[deviceID].sectionID,
    }))
}

export const lastOpenedManuscriptID = (
  projectID: string,
  userProjects: UserProject[]
): string | null => {
  const userProject = userProjects.find(
    userProject => userProject.projectID === projectID
  )

  if (!userProject) {
    return null
  }

  const lastOpened = userProject.lastOpened[deviceID]

  if (!lastOpened) {
    return null
  }

  return lastOpened.manuscriptID
}
