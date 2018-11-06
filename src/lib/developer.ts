import { USER_PROFILE } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
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

  const profile: Partial<UserProfile> = {
    _id: `${USER_PROFILE}:${userId.replace('_', '|')}`,
    objectType: USER_PROFILE,
    userID: userId,
    bibliographicName: bibliographicName as BibliographicName,
  }

  await db.projects.upsert(profile)
}
