jest.mock('../api/authentication')
jest.mock('../token')

import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import uuid from 'uuid/v4'
import { login, logout, resetPassword } from '../account'
import RxDB from '../rxdb'
import token from '../token'

RxDB.plugin(PouchDBMemoryAdapter)

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

// must be different _every_ time
const generateDbName = (prefix: string) => prefix + uuid().replace(/-/g, '_')

describe('Account', () => {
  beforeEach(() => {
    token.remove()
  })

  afterEach(() => {
    token.remove()
  })

  test('login', async () => {
    expect(token.get()).toEqual(null)

    const db = await RxDB.create({
      name: generateDbName('login'),
      adapter: 'memory',
    })

    await db.collection({
      name: 'projects',
      schema,
    })

    expect(typeof db.projects).toBe('object')

    await login('test@example.com', 'password', db)

    expect(token.get()).toEqual({
      access_token: '123',
    })

    expect(db.destroyed).toBe(true)

    expect(typeof db.projects).toBe('undefined')
  })

  test('logout', async () => {
    token.set({
      access_token: 'foo',
    })

    expect(token.get()).toEqual({
      access_token: 'foo',
    })

    const db = await RxDB.create({
      name: generateDbName('logout'),
      adapter: 'memory',
    })

    await db.collection({
      name: 'projects',
      schema,
    })

    expect(typeof db.projects).toBe('object')

    await logout(db)

    expect(token.get()).toBe(null)

    expect(db.destroyed).toBe(true)

    expect(typeof db.projects).toBe('undefined')
  })

  test('resetPassword', async () => {
    expect(token.get()).toBe(null)

    await resetPassword('foo1234', 'example')

    expect(token.get()).toEqual({
      access_token: '123',
    })
  })
})
