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

import projectDump from '@manuscripts/examples/data/project-dump.json'
import { Model } from '@manuscripts/manuscripts-json-schema'
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
  beforeAll(async () => {
    try {
      await clearChannelFolder()
    } catch {
      // ignore if the folder doesn't exist
    }
  })
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

    const initialStatus = { active: false, complete: true, error: false }
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
