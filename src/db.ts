import PouchDBHTTPAdapter = require('pouchdb-adapter-http')
import PouchDBIDBAdapter = require('pouchdb-adapter-idb')
import * as RxDB from 'rxdb'
import * as schema from './schema'
import { GroupInterface } from './types/group'
import { ManuscriptInterface } from './types/manuscript'
import { Person } from './types/person'
import { SectionInterface } from './types/section'

RxDB.QueryChangeDetector.enable()
RxDB.QueryChangeDetector.enableDebugging()

RxDB.plugin(PouchDBIDBAdapter)
RxDB.plugin(PouchDBHTTPAdapter)

const collections = [
  {
    name: 'groups',
    schema: schema.groups,
    sync: false,
  },
  {
    name: 'groupmembers',
    schema: schema.people,
    sync: false,
  },
  {
    name: 'manuscripts',
    schema: schema.manuscripts,
    sync: false,
  },
  {
    name: 'manuscriptcontributors',
    schema: schema.people,
    sync: false,
  },
  {
    name: 'sections',
    schema: schema.sections,
    sync: false,
    migrationStrategies: {
      1: (doc: RxDB.RxDocument<SectionInterface>) => {
        if (!doc.manuscript) return null

        return {
          ...doc,
          content: '',
        }
      },
    },
  },
  {
    name: 'collaborators',
    schema: schema.people,
    sync: false,
  },
]

export interface DbInterface extends RxDB.RxDatabase {
  groups: RxDB.RxCollection<GroupInterface>
  groupmembers: RxDB.RxCollection<Person>
  manuscripts: RxDB.RxCollection<ManuscriptInterface>
  manuscriptcontributors: RxDB.RxCollection<Person>
  sections: RxDB.RxCollection<SectionInterface>
  collaborators: RxDB.RxCollection<Person>
}

export const waitForDB = (async () => {
  // return RxDB.removeDatabase('manuscriptsdb', 'idb')
  //   .then(() => {
  //     console.log('removed')
  //   })
  //   .catch(error => {
  //     console.error(error)
  //   })

  const db = await RxDB.create({
    name: 'manuscriptsdb',
    adapter: 'idb',
  })

  await Promise.all(
    collections.map(async data => {
      const collection = await db.collection(data as RxDB.RxCollectionCreator)

      if (data.sync) {
        collection.sync({
          remote: `http://example.com/${collection.name}/`,
        })
      }
    })
  )

  return db as DbInterface
})()
