import { KEYWORD } from '../../src/transformer/object-types'
import { Keyword } from '../../src/types/models'

export const keywords: Keyword[] = [
  {
    _id: 'keyword-1',
    name: 'Keyword One',
    objectType: KEYWORD,
    containerID: 'project-1',
  },
  {
    _id: 'keyword-2',
    name: 'Keyword Two',
    objectType: KEYWORD,
    containerID: 'project-2',
  },
]
