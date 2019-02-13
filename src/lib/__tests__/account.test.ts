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

jest.mock('../api/authentication')
jest.mock('../adapter')

import { login, logout, resetPassword } from '../account'
import { clearChannelFolder } from '../broadcast-channel'
import { databaseCreator, recreateDatabase } from '../db'

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
  beforeEach(recreateDatabase)
  afterAll(clearChannelFolder)
  beforeAll(clearChannelFolder)

  test('login', async () => {
    const db = await databaseCreator

    await db.collection({
      name: 'projects',
      schema,
    })

    expect(typeof db.projects).toBe('object')

    const token = await login('test@example.com', 'password')

    expect(token).toEqual('123')

    expect(db.destroyed).toBe(true)

    expect(typeof db.projects).toBe('undefined')

    const afterDB = await databaseCreator

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
