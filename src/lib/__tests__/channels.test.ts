import { user } from '../../../stories/data/contributors'
import projects from '../../../stories/data/projects'
import { buildCollaboratorChannels } from '../channels'

describe('channels', () => {
  test('buildCollaboratorChannels', async () => {
    const result = buildCollaboratorChannels(user.userID, projects)

    const expected = ['user_1-read', 'user_3-read', 'user_2-read']

    expect(result).toEqual(expected)
  })
})
