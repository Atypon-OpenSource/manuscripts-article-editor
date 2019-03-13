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

import { Build, generateID, timestamp } from '@manuscripts/manuscript-transform'
import {
  ObjectTypes,
  Project,
  UserProject,
} from '@manuscripts/manuscripts-json-schema'

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
  deviceID: string,
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
