/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
