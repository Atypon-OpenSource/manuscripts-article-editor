import PouchDBHTTPAdapter = require('pouchdb-adapter-http')
import PouchDBIDBAdapter = require('pouchdb-adapter-idb')
import * as RxDB from 'rxdb'
import * as schema from './schema'
import { GroupInterface } from './types/group'
import { ManuscriptInterface } from './types/manuscript'
import { Person } from './types/person'

RxDB.QueryChangeDetector.enable()
RxDB.QueryChangeDetector.enableDebugging()

RxDB.plugin(PouchDBIDBAdapter)
RxDB.plugin(PouchDBHTTPAdapter)

const collections = [
  {
    name: 'groups',
    schema: schema.groups,
    // sync: true,
  },
  {
    name: 'manuscripts',
    schema: schema.manuscripts,
    // sync: true,
  },
  {
    name: 'collaborators',
    schema: schema.collaborators,
    // sync: true,
  },
]

export interface DbInterface extends RxDB.RxDatabase {
  groups: RxDB.RxCollection<GroupInterface>
  manuscripts: RxDB.RxCollection<ManuscriptInterface>
  collaborators: RxDB.RxCollection<Person>
}

export const waitForDB = RxDB.create({
  name: 'manuscriptsdb',
  adapter: 'idb',
}).then(db =>
  Promise.all(
    collections.map(data => db.collection(data as RxDB.RxCollectionCreator))
  )
    // .then(collections =>
    //   collections.filter(col => col.sync).map(col =>
    //     col.sync({
    //       remote: `http://example.com/${col.name}/`,
    //     })
    //   )
    // )
    .then(() => db as DbInterface)
)
