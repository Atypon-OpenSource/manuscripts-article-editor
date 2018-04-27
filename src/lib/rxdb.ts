import * as PouchDBHTTPAdapter from 'pouchdb-adapter-http'
import * as PouchDBIDBAdapter from 'pouchdb-adapter-idb'
import { RxCollection, RxDatabase } from 'rxdb'
import RxDBAttachmentsModule from 'rxdb/plugins/attachments'
import RxDB from 'rxdb/plugins/core'
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages'
// import RxDBKeyCompressionModule from 'rxdb/plugins/key-compression'
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election'
import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check'
import RxDBUpdateModule from 'rxdb/plugins/update'
import {
  RxChangeEventInsert,
  RxChangeEventRemove,
  RxChangeEventUpdate,
} from 'rxdb/src/typings/rx-change-event'
import {
  AnyComponent,
  ComponentCollection,
  Group,
  Person,
} from '../types/components'

RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

RxDB.plugin(PouchDBIDBAdapter)
RxDB.plugin(PouchDBHTTPAdapter)
RxDB.plugin(RxDBNoValidateModule)
RxDB.plugin(RxDBReplicationModule)
RxDB.plugin(RxDBAttachmentsModule)
RxDB.plugin(RxDBLeaderElectionModule)
RxDB.plugin(RxDBUpdateModule)
// RxDB.plugin(RxDBKeyCompressionModule)

if (process.env.NODE_ENV === 'development') {
  RxDB.plugin(RxDBErrorMessagesModule)
  RxDB.plugin(RxDBSchemaCheckModule)
}

window.RxDB = RxDB

export interface Db extends RxDatabase {
  components: ComponentCollection
  groups: RxCollection<Group>
  groupmembers: RxCollection<Person>
  collaborators: RxCollection<Person>
}

export type AnyComponentChangeEvent =
  | RxChangeEventInsert<AnyComponent>
  | RxChangeEventUpdate<AnyComponent>
  | RxChangeEventRemove<AnyComponent>

export const waitForDB = RxDB.create({
  name: 'manuscriptsdb',
  adapter: 'idb',
}) as Promise<Db>

export const removeDB = () =>
  RxDB.removeDatabase('manuscriptsdb', 'idb')
    .then(() => {
      console.log('removed') // tslint:disable-line:no-console
    })
    .catch((error: Error) => {
      console.error(error) // tslint:disable-line:no-console
    })
