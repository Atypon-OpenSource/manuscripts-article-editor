import { timestamp } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  ObjectTypes,
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

  const createdAt = timestamp()

  const profile: Partial<UserProfile> = {
    _id: `${ObjectTypes.UserProfile}:${userId.replace('_', '|')}`,
    objectType: ObjectTypes.UserProfile,
    userID: userId,
    bibliographicName: bibliographicName as BibliographicName,
    createdAt,
    updatedAt: createdAt,
  }

  await db.projects.upsert(profile)
}
