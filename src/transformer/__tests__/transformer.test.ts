jest.mock('../serializer')

import { Decoder } from '../decode'
import { encode } from '../encode'
import { createTestModelMap } from './__helpers__/doc'

test('transformer', async () => {
  const input = createTestModelMap()
  const decoder = new Decoder(input)
  const doc = decoder.createArticleNode()
  const output = encode(doc)

  for (const [id, item] of input.entries()) {
    if (output.has(id)) {
      output.set(id, {
        ...item,
        ...output.get(id),
      })
    } else {
      output.set(id, item)
    }
  }

  for (const [id, item] of output.entries()) {
    expect(item).toEqual(input.get(id))
  }
})
