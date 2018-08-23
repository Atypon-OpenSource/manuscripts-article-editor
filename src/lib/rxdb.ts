import PouchDBHTTPAdapter from 'pouchdb-adapter-http'
import PouchDBIDBAdapter from 'pouchdb-adapter-idb'
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

RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

RxDB.plugin(PouchDBIDBAdapter)
RxDB.plugin(PouchDBHTTPAdapter)
RxDB.plugin(RxDBNoValidateModule)
RxDB.plugin(RxDBReplicationModule)
RxDB.plugin(RxDBAttachmentsModule)
RxDB.plugin(RxDBLeaderElectionModule)
RxDB.plugin(RxDBUpdateModule)
RxDB.plugin(RxDBLocalDocumentsModule)

// RxDB.plugin(RxDBKeyCompressionModule)

/* istanbul ignore next */
if (config.environment === 'development') {
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

export const waitForDB = RxDB.create({
  name: 'manuscriptsdb',
  adapter: 'idb',
})

export const removeDB = () =>
  RxDB.removeDatabase('manuscriptsdb', 'idb')
    .then(() => {
      console.log('removed') // tslint:disable-line:no-console
    })
    .catch((error: Error) => {
      console.error(error) // tslint:disable-line:no-console
    })
