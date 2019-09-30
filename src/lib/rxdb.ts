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

import PouchDBHTTPAdapter from '@manuscripts/pouchdb-adapter-http'
import RxDBAttachmentsModule from '@manuscripts/rxdb/plugins/attachments'
import RxDB from '@manuscripts/rxdb/plugins/core'
import RxDBErrorMessagesModule from '@manuscripts/rxdb/plugins/error-messages'
import RxDBLocalDocumentsModule from '@manuscripts/rxdb/plugins/local-documents'
import RxDBNoValidateModule from '@manuscripts/rxdb/plugins/no-validate'
import RxDBReplicationModule from '@manuscripts/rxdb/plugins/replication'
import RxDBSchemaCheckModule from '@manuscripts/rxdb/plugins/schema-check'
import RxDBUpdateModule from '@manuscripts/rxdb/plugins/update'
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
