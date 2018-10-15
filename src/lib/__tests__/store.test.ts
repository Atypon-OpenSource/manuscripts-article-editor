import { KEYWORD } from '../../transformer/object-types'
import { Keyword } from '../../types/components'
import sessionID from '../sessionID'
import { prepareUpdate } from '../store'

test('should add/remove appropriate fields for update', () => {
  const data: Partial<Keyword> = {
    _id: 'keyword-1',
    objectType: KEYWORD,
    name: 'foo',
  }

  const result = prepareUpdate<Keyword>(data)

  expect(result.name).toBe(data.name)
  expect(result._id).toBeUndefined()
  expect(typeof result.updatedAt).toBe('number')
  expect(result.sessionID).toBe(sessionID)
})
