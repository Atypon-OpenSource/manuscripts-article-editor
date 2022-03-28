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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHistory = exports.SnapshotStatus = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = require("react");
const snapshot_1 = require("../lib/snapshot");
const store_1 = require("../store");
var SnapshotStatus;
(function (SnapshotStatus) {
    SnapshotStatus["Ready"] = "ready";
    SnapshotStatus["Loading"] = "loading";
    SnapshotStatus["Done"] = "done";
    SnapshotStatus["Error"] = "error";
    SnapshotStatus["Writing"] = "writing";
})(SnapshotStatus = exports.SnapshotStatus || (exports.SnapshotStatus = {}));
const buildModelMap = (models) => {
    return new Map(models.map((model) => {
        if (model.objectType === manuscripts_json_schema_1.ObjectTypes.Figure && model.attachment) {
            model.src = window.URL.createObjectURL(model.attachment.data);
        }
        return [model._id, model];
    }));
};
const useHistory = (projectID) => {
    const [loadSnapshotStatus, setLoadSnapshotStatus] = react_1.useState(SnapshotStatus.Ready);
    const [snapshotsList, setSnapshotsList] = react_1.useState([]);
    const [snapshots] = store_1.useStore((state) => state.snapshots || []);
    react_1.useEffect(() => {
        // do we need a useEffect here, will the user store trigger a chain update automatically?
        setSnapshotsList(snapshots);
    }, [snapshots]);
    const [current, setCurrent] = react_1.useState(null);
    const loadSnapshot = react_1.useCallback((remoteID, manuscriptID) => {
        setLoadSnapshotStatus(SnapshotStatus.Loading);
        return snapshot_1.getSnapshot(projectID, remoteID)
            .then((res) => {
            const manuscripts = res.filter((model) => model.objectType === manuscripts_json_schema_1.ObjectTypes.Manuscript);
            const modelMap = buildModelMap(res.filter((doc) => !doc.manuscriptID || doc.manuscriptID === manuscriptID));
            const decoder = new manuscript_transform_1.Decoder(modelMap, true);
            const doc = decoder.createArticleNode();
            setLoadSnapshotStatus(SnapshotStatus.Done);
            setCurrent({
                doc,
                modelMap,
                manuscripts,
            });
        })
            .catch(() => {
            setLoadSnapshotStatus(SnapshotStatus.Error);
        });
    }, [projectID]);
    return {
        snapshotsList,
        loadSnapshot,
        loadSnapshotStatus,
        currentSnapshot: current,
    };
};
exports.useHistory = useHistory;
//# sourceMappingURL=use-history.js.map