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
