import uuid from 'uuid'
import nodeTypes from './node-types'

export const generateID = (type: string) => {
  if (!nodeTypes.has(type)) return null // only generate IDs for specific types

  const jsonType = nodeTypes.get(type)

  return jsonType + ':' + uuid.v4().toUpperCase()
}
