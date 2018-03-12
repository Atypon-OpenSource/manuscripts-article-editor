import PouchDBHTTPAdapter = require('pouchdb-adapter-http')
import PouchDBIDBAdapter = require('pouchdb-adapter-idb')
import * as RxDB from 'rxdb'
import * as schema from './schema'
import { AnyComponent, Group, Person } from './types/components'

RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

RxDB.plugin(PouchDBIDBAdapter)
RxDB.plugin(PouchDBHTTPAdapter)

const collections = [
  {
    name: 'components',
    schema: schema.components,
    sync: true,
  },
  {
    name: 'groups',
    schema: schema.groups,
    sync: true,
  },
  {
    name: 'groupmembers',
    schema: schema.people,
    sync: true,
  },
  {
    name: 'collaborators',
    schema: schema.people,
    sync: true,
  },
]

export interface Db extends RxDB.RxDatabase {
  components: RxDB.RxCollection<AnyComponent>
  groups: RxDB.RxCollection<Group>
  groupmembers: RxDB.RxCollection<Person>
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
      try {
        // tslint:disable-next-line
        const collection = await db.collection(data as RxDB.RxCollectionCreator)

        // if (data.sync) {
        //   collection.sync({
        //     remote: `http://example.com/${collection.name}/`,
        //   })
        // }
      } catch (error) {
        console.error(error) // tslint:disable-line
      }
    })
  )

  return db as Db
})()
