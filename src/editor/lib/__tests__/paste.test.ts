import { Slice } from 'prosemirror-model'
import schema from '../../config/schema'
import { transformPasted } from '../paste'

test('transformPasted handler', () => {
  const slice = Slice.fromJSON(schema, {
    content: [
      {
        type: 'paragraph',
        attrs: {},
        content: [{ type: 'hard_break' }],
      },
      {
        type: 'paragraph',
        attrs: {},
        content: [
          {
            type: 'text',
            text:
              'These rhythmic patterns then sum together to create the signals that muscles need to carry out the movements.',
          },
        ],
      },
    ],
    openStart: 1,
    openEnd: 1,
  })

  expect(slice.content.childCount).toBe(2)

  const result = transformPasted(slice)

  expect(result.content.childCount).toBe(1)
  expect(result.content.size).toBe(111)

  expect(result).toMatchSnapshot('transform-pasted')
})
