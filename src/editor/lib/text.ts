import { parse, schema } from '../title/config'

export const titleText = (value: string) => {
  const node = parse(value, {
    topNode: schema.nodes.title.create(),
  })

  return node.textContent
}
