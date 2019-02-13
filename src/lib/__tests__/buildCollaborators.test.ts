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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { people } from '../../../stories/data/people'
import { project } from '../../../stories/data/projects'
import { buildCollaborators } from '../collaborators'

const collaboratorsMap: Map<string, UserProfileWithAvatar> = new Map()

for (const item of people) {
  collaboratorsMap.set(item.userID, item)
}

describe('collaborators', () => {
  test('build collaborators', () => {
    const result = buildCollaborators(project, collaboratorsMap)

    expect(result).toHaveLength(1)
  })
})
