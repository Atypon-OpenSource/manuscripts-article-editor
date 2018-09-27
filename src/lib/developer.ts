import { USER_PROFILE } from '../transformer/object-types'
import { BibliographicName } from '../types/components'
import { databaseCreator } from './db'
import token from './token'

export const createToken = (userId: string) => {
  token.set({
    access_token: ['', btoa(JSON.stringify({ userId })), ''].join('.'),
  })
}

export const createUserProfile = /* istanbul ignore next */ async (
  userId: string,
  bibliographicName: Partial<BibliographicName>
) => {
  if (!userId) {
    alert('Create a token first')
  }

  const db = await databaseCreator

  await db.projects.upsert({
    id: `${USER_PROFILE}:${userId.replace('_', '|')}`,
    objectType: USER_PROFILE,
    userID: userId,
    bibliographicName,
  })
}
