import * as uuid from 'uuid'

export const generateID = (objectType: string) =>
  objectType + ':' + uuid.v4().toUpperCase()
