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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoadDoc = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const config_1 = __importDefault(require("../config"));
const useAuthStore_1 = require("./useAuthStore");
const useDocStore_1 = require("./useDocStore");
const useSnapshotStore_1 = require("./useSnapshotStore");
const useLoadDoc = () => {
    const { authenticate } = useAuthStore_1.useAuthStore();
    const { createDocument, getDocument, setCurrentDocument } = useDocStore_1.useDocStore();
    const { init: initSnapshots, setSnapshots } = useSnapshotStore_1.useSnapshotStore();
    return function loadDoc(manuscriptID, projectID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config_1.default.quarterback.enabled) {
                return undefined;
            }
            const auth = yield authenticate();
            if (!auth) {
                return undefined;
            }
            setCurrentDocument(manuscriptID, projectID);
            const found = yield getDocument(manuscriptID);
            let doc;
            if ('data' in found) {
                initSnapshots();
                setSnapshots(found.data.snapshots);
                doc = found.data.doc;
            }
            else if ('err' in found && found.code === 404) {
                // Create an empty doc that will be replaced with whatever document is currently being edited
                createDocument(manuscriptID, projectID);
            }
            if (doc !== null &&
                typeof doc === 'object' &&
                Object.keys(doc).length !== 0) {
                return manuscript_transform_1.schema.nodeFromJSON(doc);
            }
            return undefined;
        });
    };
};
exports.useLoadDoc = useLoadDoc;
//# sourceMappingURL=useLoadDoc.js.map