import { encode } from '../encode'
import { createTestDoc } from './__helpers__/doc'

describe('transformer', () => {
  test('Encoder', async () => {
    const doc = createTestDoc()

    const result = encode(doc)

    expect(result).toMatchSnapshot()
  })
})
