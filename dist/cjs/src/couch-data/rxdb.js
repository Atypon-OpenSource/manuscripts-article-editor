"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pouchdb_adapter_http_1 = __importDefault(require("@manuscripts/pouchdb-adapter-http"));
const attachments_1 = __importDefault(require("@manuscripts/rxdb/plugins/attachments"));
const core_1 = __importDefault(require("@manuscripts/rxdb/plugins/core"));
const error_messages_1 = __importDefault(require("@manuscripts/rxdb/plugins/error-messages"));
const local_documents_1 = __importDefault(require("@manuscripts/rxdb/plugins/local-documents"));
const no_validate_1 = __importDefault(require("@manuscripts/rxdb/plugins/no-validate"));
const replication_1 = __importDefault(require("@manuscripts/rxdb/plugins/replication"));
const schema_check_1 = __importDefault(require("@manuscripts/rxdb/plugins/schema-check"));
const update_1 = __importDefault(require("@manuscripts/rxdb/plugins/update"));
const config_1 = __importDefault(require("../config"));
core_1.default.plugin(pouchdb_adapter_http_1.default);
core_1.default.plugin(no_validate_1.default);
core_1.default.plugin(replication_1.default);
core_1.default.plugin(attachments_1.default);
core_1.default.plugin(update_1.default);
core_1.default.plugin(local_documents_1.default);
if (config_1.default.environment !== 'production') {
    core_1.default.plugin(error_messages_1.default);
    core_1.default.plugin(schema_check_1.default);
}
window.RxDB = core_1.default;
exports.default = core_1.default;
//# sourceMappingURL=rxdb.js.map