/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

jest.mock('../api/authentication')
jest.mock('../adapter')

import decode from 'jwt-decode'

import { login, logout, resetPassword } from '../account'
import { clearChannelFolder } from '../broadcast-channel'
import { databaseCreator, recreateDatabase } from '../db'
import { TokenPayload } from '../user'

const schema = {
  version: 0,
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      primary: true,
    },
    title: {
      type: 'string',
    },
  },
}

describe('Account', () => {
  beforeAll(clearChannelFolder)
  beforeEach(recreateDatabase)
  afterAll(clearChannelFolder)

  test('login', async () => {
    const db = await databaseCreator

    await db.collection({
      name: 'projects',
      schema,
    })

    expect(typeof db.projects).toBe('object')

    const { token } = await login('test@example.com', 'password')

    const { userId } = decode<TokenPayload>(token)

    expect(userId).toEqual('User|test@example.com')

    expect(db.destroyed).toBe(true)

    expect(typeof db.projects).toBe('undefined')

    const afterDB = await recreateDatabase()

    expect(afterDB.destroyed).toBe(false)

    expect(typeof afterDB.projects).toBe('undefined')

    await afterDB.collection({
      name: 'projects',
      schema,
    })

    expect(typeof afterDB.projects).toBe('object')
  })

  test('logout', async () => {
    const db = await databaseCreator

    await db.collection({
      name: 'projects',
      schema,
    })

    expect(typeof db.projects).toBe('object')

    await logout()

    expect(db.destroyed).toBe(true)

    expect(typeof db.projects).toBe('undefined')
  })

  test('resetPassword', async () => {
    const token = await resetPassword('foo1234', 'foo.eyJ3YXlmTG9jYWwiOiJ4In0=')

    expect(token).toEqual('123')
  })
})
