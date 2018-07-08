import { USER_PROFILE } from '../transformer/object-types'
import { BibliographicName } from '../types/components'
import { Db, waitForDB } from './rxdb'
import token from './token'

export const createToken = /* istanbul ignore next */ (userId: string) => {
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

  const db: Db = await waitForDB

  await db.projects.upsert({
    id: `${USER_PROFILE}:${userId.replace('_', '|')}`,
    objectType: USER_PROFILE,
    userID: userId,
    bibliographicName,
  })
}
