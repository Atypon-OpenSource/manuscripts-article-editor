import { timestamp } from '@manuscripts/manuscript-editor'
import { Keyword, ObjectTypes } from '@manuscripts/manuscripts-json-schema'

export const keywords: Keyword[] = [
  {
    _id: 'keyword-1',
    name: 'Keyword One',
    objectType: ObjectTypes.Keyword,
    containerID: 'project-1',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
  {
    _id: 'keyword-2',
    name: 'Keyword Two',
    objectType: ObjectTypes.Keyword,
    containerID: 'project-2',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
]
