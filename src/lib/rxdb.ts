import PouchDBHTTPAdapter from 'pouchdb-adapter-http'
import PouchDBIDBAdapter from 'pouchdb-adapter-idb'
import PouchDBMemoryAdapter from 'pouchdb-adapter-memory'
import RxDBAttachmentsModule from 'rxdb/plugins/attachments'
import RxDB from 'rxdb/plugins/core'
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages'
// import RxDBKeyCompressionModule from 'rxdb/plugins/key-compression'
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election'
import RxDBLocalDocumentsModule from 'rxdb/plugins/local-documents'
import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check'
import RxDBUpdateModule from 'rxdb/plugins/update'
import {
  RxChangeEventInsert,
  RxChangeEventRemove,
  RxChangeEventUpdate,
} from 'rxdb/src/typings/rx-change-event'
import config from '../config'
import { AnyComponent } from '../types/components'

// TODO: re-enable QueryChangeDetector once the fix is released:
// https://github.com/pubkey/rxdb/issues/754
// RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

if (config.environment === 'test') {
  RxDB.plugin(PouchDBMemoryAdapter)
} else {
  RxDB.plugin(PouchDBIDBAdapter)
}

RxDB.plugin(PouchDBHTTPAdapter)
RxDB.plugin(RxDBNoValidateModule)
RxDB.plugin(RxDBReplicationModule)
RxDB.plugin(RxDBAttachmentsModule)
RxDB.plugin(RxDBLeaderElectionModule)
RxDB.plugin(RxDBUpdateModule)
RxDB.plugin(RxDBLocalDocumentsModule)

// RxDB.plugin(RxDBKeyCompressionModule)

/* istanbul ignore next */
if (config.environment !== 'production') {
  RxDB.plugin(RxDBErrorMessagesModule)
  RxDB.plugin(RxDBSchemaCheckModule)
}

window.RxDB = RxDB

export type AnyComponentChangeEvent =
  | RxChangeEventInsert<AnyComponent>
  | RxChangeEventUpdate<AnyComponent>
  | RxChangeEventRemove<AnyComponent>

export interface Db {
  [key: string]: any // tslint:disable-line:no-any
}

const createDB = () =>
  RxDB.create({
    name: 'manuscriptsdb',
    adapter: config.environment === 'test' ? 'memory' : 'idb',
  })

export let waitForDB = createDB()

export const removeDB = async () => {
  const db = await waitForDB

  await db.remove()

  waitForDB = createDB()

  return waitForDB
}
