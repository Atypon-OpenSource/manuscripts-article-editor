import { encode } from '../encode'
import { createTestDoc } from './decode.test'

describe('transformer', () => {
  test('Encoder', async () => {
    const doc = createTestDoc()

    const result = encode(doc)

    expect(result).toMatchSnapshot()
  })
})
