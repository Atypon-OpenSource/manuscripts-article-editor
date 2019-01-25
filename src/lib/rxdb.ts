import PouchDBHTTPAdapter from 'pouchdb-adapter-http'
import RxDBAttachmentsModule from 'rxdb/plugins/attachments'
import RxDB from 'rxdb/plugins/core'
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages'
import RxDBLocalDocumentsModule from 'rxdb/plugins/local-documents'
import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check'
import RxDBUpdateModule from 'rxdb/plugins/update'
import config from '../config'

RxDB.plugin(PouchDBHTTPAdapter)
RxDB.plugin(RxDBNoValidateModule)
RxDB.plugin(RxDBReplicationModule)
RxDB.plugin(RxDBAttachmentsModule)
RxDB.plugin(RxDBUpdateModule)
RxDB.plugin(RxDBLocalDocumentsModule)

if (config.environment !== 'production') {
  RxDB.plugin(RxDBErrorMessagesModule)
  RxDB.plugin(RxDBSchemaCheckModule)
}

window.RxDB = RxDB

export default RxDB
