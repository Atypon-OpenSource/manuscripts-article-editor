import { generateID } from '../transformer/id'
import { CONTRIBUTOR, MANUSCRIPT, PROJECT } from '../transformer/object-types'
import { Contributor, Manuscript, UserProfile } from '../types/components'
import sessionID from './sessionID'

export const buildProject = (owner: string) => {
  const id = generateID('project') as string
  const now = Date.now()

  return {
    id,
    project: id,
    objectType: PROJECT,
    owners: [owner],
    createdAt: now,
    updatedAt: now,
    sessionID,
    title: '',
  }
}

export const buildManuscript = (project: string, owner: string): Manuscript => {
  const id = generateID('manuscript') as string
  const now = Date.now()

  return {
    id,
    project,
    objectType: MANUSCRIPT,
    owners: [owner],
    createdAt: now,
    updatedAt: now,
    sessionID,
    title: '',
  }
}

export const buildContributor = (user: UserProfile): Contributor => {
  const id = generateID('contributor') as string

  return {
    id,
    objectType: CONTRIBUTOR,
    priority: 0,
    role: 'author',
    affiliations: [],
    bibliographicName: {
      id: generateID('bibliographic_name') as string,
      ...user.bibliographicName,
    },
  }
}
