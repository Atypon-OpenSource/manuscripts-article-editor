import { NodeSpec } from 'prosemirror-model'

export const figcaption: NodeSpec = {
  content: 'inline*',
  group: 'block',
  isolating: true,
  parseDOM: [
    {
      tag: 'figcaption',
    },
  ],
  toDOM: () => ['figcaption', 0],
}
