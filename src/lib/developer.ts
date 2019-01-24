import { Build } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  ObjectTypes,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import decode from 'jwt-decode'
import uuid from 'uuid/v4'
import { Database } from '../components/DatabaseProvider'
import CollectionManager from '../sync/CollectionManager'
import tokenHandler from './token'
import { TokenPayload } from './user'

export const createToken = () => {
  const data: TokenPayload = {
    expiry: +new Date() + 10000,
    userId: 'developer@example.com',
    userProfileId: `${ObjectTypes.UserProfile}:${uuid()}`,
  }

  const token = ['', btoa(JSON.stringify(data)), ''].join('.')

  tokenHandler.set(token)
}

export const createUserProfile = async (db: Database) => {
  createToken()

  const token = tokenHandler.get()

  const { userId: userID, userProfileId: userProfileID } = decode<TokenPayload>(
    token!
  )

  const bibliographicName: BibliographicName = {
    _id: 'MPBibliographicName:developer',
    objectType: ObjectTypes.BibliographicName,
    given: 'Developer',
    family: 'User',
  }

  const profile: Build<UserProfile> = {
    _id: userProfileID,
    objectType: ObjectTypes.UserProfile,
    userID,
    bibliographicName,
  }

  const userCollection = await CollectionManager.createCollection<UserProfile>({
    collection: 'user',
    channels: [],
    db,
  })

  await userCollection.create(profile)
}
