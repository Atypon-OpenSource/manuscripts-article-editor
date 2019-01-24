jest.mock('../api/authentication')

import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import uuid from 'uuid/v4'
import { login, logout, resetPassword } from '../account'
import RxDB from '../rxdb'

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
  test('login', async () => {
    const db = await RxDB.create({
      name: generateDbName('login'),
      adapter: 'memory',
    })

    await db.collection({
      name: 'projects',
      schema,
    })

    expect(typeof db.projects).toBe('object')

    const token = await login('test@example.com', 'password', db)

    expect(token).toEqual('123')

    expect(db.destroyed).toBe(true)

    expect(typeof db.projects).toBe('undefined')
  })

  test('logout', async () => {
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

    expect(db.destroyed).toBe(true)

    expect(typeof db.projects).toBe('undefined')
  })

  test('resetPassword', async () => {
    const token = await resetPassword('foo1234', 'foo.eyJ3YXlmTG9jYWwiOiJ4In0=')

    expect(token).toEqual('123')
  })
})
