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
