"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleSnapshot = void 0;
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
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const useEditorStore_1 = require("../components/track-changes/useEditorStore");
const getDocWithoutTrackContent_1 = require("../quarterback/getDocWithoutTrackContent");
const usePouchStore_1 = require("../quarterback/usePouchStore");
const useSnapshotStore_1 = require("../quarterback/useSnapshotStore");
const useHandleSnapshot = (storeExists = true) => {
    const { execCmd, docToJSON } = useEditorStore_1.useEditorStore();
    const { saveSnapshot } = useSnapshotStore_1.useSnapshotStore();
    if (!storeExists) {
        return null;
    }
    return () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield saveSnapshot(docToJSON());
        if ('data' in resp) {
            execCmd(track_changes_plugin_1.trackCommands.applyAndRemoveChanges());
            setTimeout(() => {
                const state = useEditorStore_1.useEditorStore.getState().editorState;
                if (!state) {
                    return;
                }
                usePouchStore_1.usePouchStore.getState().saveDoc(getDocWithoutTrackContent_1.getDocWithoutTrackContent(state));
            });
        }
    });
};
exports.useHandleSnapshot = useHandleSnapshot;
//# sourceMappingURL=use-handle-snapshot.js.map