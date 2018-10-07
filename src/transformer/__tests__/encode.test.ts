jest.mock('../serializer')

import { encode } from '../encode'
import { createTestDoc } from './__helpers__/doc'

test('encoder', async () => {
  const doc = createTestDoc()

  const result = encode(doc)

  expect(result).toMatchSnapshot()
})
