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
