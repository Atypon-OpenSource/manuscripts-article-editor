import projectDump from '@manuscripts/examples/data/project-dump.json'
import { Model } from '@manuscripts/manuscripts-json-schema/dist/types'
import uuid from 'uuid/v4'
import { clearChannelFolder } from '../../lib/broadcast-channel'
import { databaseCreator } from '../../lib/db'
import { Collection, isBulkDocsError, isBulkDocsSuccess } from '../Collection'

jest.mock('../../lib/adapter')

const items = (projectDump.data as Model[]).map(item => {
  delete item._rev

  return item
})

const generateDbName = (prefix: string) => prefix + uuid().replace(/-/g, '_')

describe('Collection', () => {
  beforeAll(clearChannelFolder)
  afterAll(clearChannelFolder)

  test('new collection', async () => {
    const db = await databaseCreator

    const collection = new Collection({
      collection: 'test',
      db,
    })

    expect(collection).toBeInstanceOf(Collection)
    expect(collection.collectionName).toBe('test')
  })

  test('new project collection', async () => {
    const db = await databaseCreator

    const collection = new Collection({
      collection: generateDbName('project-MPProject:'),
      db,
    })

    expect(collection).toBeInstanceOf(Collection)
    expect(collection.collectionName).toMatch(/^project_mpproject_/)
  })

  test('initialise collection', async () => {
    const db = await databaseCreator

    const collection = new Collection({
      collection: 'user',
      db,
    })

    await collection.initialize(false)

    const initialStatus = { active: false, complete: false, error: false }
    expect(collection.status.pull).toMatchObject(initialStatus)
    expect(collection.status.push).toMatchObject(initialStatus)
  })

  test('bulk create', async () => {
    const db = await databaseCreator

    const collection = new Collection({
      collection: generateDbName('project-MPProject:'),
      db,
    })

    await collection.initialize(false)

    const results = await collection.bulkCreate([...items])

    expect(results).toHaveLength(items.length)

    expect(results.filter(isBulkDocsSuccess)).toHaveLength(items.length)
    expect(results.filter(isBulkDocsError)).toHaveLength(0)
  })

  test('bulk create with errors', async () => {
    const db = await databaseCreator

    const collection = new Collection({
      collection: generateDbName('project-MPProject:'),
      db,
    })

    await collection.initialize(false)

    const conflicts = items.slice(-2).map(item => ({
      ...item,
      _rev: '3-16c9025f8d2f4705a67337146f88bb2f',
    }))

    const results = await collection.bulkCreate([...items, ...conflicts])

    expect(results).toHaveLength(items.length + conflicts.length)

    expect(results.filter(isBulkDocsSuccess)).toHaveLength(items.length)
    expect(results.filter(isBulkDocsError)).toHaveLength(conflicts.length)
  })
})
