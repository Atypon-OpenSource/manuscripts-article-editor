import * as PouchDBHTTPAdapter from 'pouchdb-adapter-http'
import * as PouchDBIDBAdapter from 'pouchdb-adapter-idb'
import RxDBAttachmentsModule from 'rxdb/plugins/attachments'
import RxDB from 'rxdb/plugins/core'
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages'
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election'
import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check'
import RxDBUpdateModule from 'rxdb/plugins/update'
import * as schema from './schema'
import { AnyComponent, Group, Person } from './types/components'

window.RxDB = RxDB

RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

RxDB.plugin(PouchDBIDBAdapter)
RxDB.plugin(PouchDBHTTPAdapter)
RxDB.plugin(RxDBNoValidateModule)
RxDB.plugin(RxDBReplicationModule)
RxDB.plugin(RxDBAttachmentsModule)
RxDB.plugin(RxDBLeaderElectionModule)
RxDB.plugin(RxDBUpdateModule)

if (process.env.NODE_ENV === 'development') {
  RxDB.plugin(RxDBErrorMessagesModule)
  RxDB.plugin(RxDBSchemaCheckModule)
}

const collections = [
  {
    name: 'components',
    schema: schema.components,
    remote: 'manuscript_data',
  },
  {
    name: 'groups',
    schema: schema.groups,
  },
  {
    name: 'groupmembers',
    schema: schema.people,
  },
  {
    name: 'collaborators',
    schema: schema.people,
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
        const collection = await db.collection({
          name: data.name,
          schema: data.schema,
        })

        if (data.remote) {
          collection
            .sync({
              remote: process.env.SYNC_GATEWAY_URL + data.remote,
              waitForLeadership: false, // TODO: remove this for production
            })
            .error$.subscribe((error: Error) => {
              console.error(error) // tslint:disable-line:no-console
            })
        }
      } catch (error) {
        console.error(error) // tslint:disable-line
      }
    })
  )

  return db as Db
})()
