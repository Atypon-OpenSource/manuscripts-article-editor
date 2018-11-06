import { Model } from '@manuscripts/manuscripts-json-schema'
import PouchDBHTTPAdapter from 'pouchdb-adapter-http'
import {
  RxChangeEventInsert,
  RxChangeEventRemove,
  RxChangeEventUpdate,
} from 'rxdb'
import RxDBAttachmentsModule from 'rxdb/plugins/attachments'
import RxDB from 'rxdb/plugins/core'
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages'
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election'
import RxDBLocalDocumentsModule from 'rxdb/plugins/local-documents'
import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check'
import RxDBUpdateModule from 'rxdb/plugins/update'
import config from '../config'

// TODO: re-enable QueryChangeDetector once the fix is released:
// https://github.com/pubkey/rxdb/issues/754
// RxDB.QueryChangeDetector.enable()
// RxDB.QueryChangeDetector.enableDebugging()

RxDB.plugin(PouchDBHTTPAdapter)
RxDB.plugin(RxDBNoValidateModule)
RxDB.plugin(RxDBReplicationModule)
RxDB.plugin(RxDBAttachmentsModule)
RxDB.plugin(RxDBLeaderElectionModule)
RxDB.plugin(RxDBUpdateModule)
RxDB.plugin(RxDBLocalDocumentsModule)

if (config.environment !== 'production') {
  RxDB.plugin(RxDBErrorMessagesModule)
  RxDB.plugin(RxDBSchemaCheckModule)
}

window.RxDB = RxDB

export type ModelChangeEvent =
  | RxChangeEventInsert<Model>
  | RxChangeEventUpdate<Model>
  | RxChangeEventRemove<Model>

export default RxDB
