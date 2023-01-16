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
const channels_1 = require("../channels");
const config_1 = __importDefault(require("../config"));
const api_1 = require("../lib/api");
const native_1 = require("../lib/native");
const CollectionManager_1 = __importDefault(require("./CollectionManager"));
const syncErrors_1 = require("./syncErrors");
let suspend = false;
exports.default = (dispatch) => (action) => {
    /* tslint:disable:no-console */
    if (config_1.default.logSyncEvents) {
        if (action.payload.error) {
            console.error(action.payload.error);
        }
        console.log(action);
    }
    /* tslint:enable:no-console */
    if (suspend) {
        dispatch(action);
        return;
    }
    if (syncErrors_1.isUnauthorized(action.payload)) {
        suspend = true;
        if (config_1.default.native) {
            native_1.postWebkitMessage('sync', {});
        }
        else {
            api_1.refreshSyncSessions()
                .then(() => {
                suspend = false;
                CollectionManager_1.default.restartAll();
            })
                .catch(() => {
                suspend = false;
                dispatch(action);
            });
        }
        return;
    }
    if (action.payload.broadcast) {
        // dispatch also between other tabs between tabs.
        channels_1.channels.syncState.postMessage(JSON.stringify(action));
    }
};
//# sourceMappingURL=CollectionEffects.js.map