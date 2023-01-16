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
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = require("react");
const utils_1 = require("../components/track-changes/utils");
const node_attrs_1 = require("../lib/node-attrs");
const replace_attachments_ids_1 = require("../lib/replace-attachments-ids");
const store_1 = require("../store");
const useTrackedModelManagement = (doc, view, state, dispatch, saveModel, deleteModel, finalModelMap, getAttachments) => {
    const modelMap = react_1.useMemo(() => {
        const docJSONed = doc.toJSON();
        const docClean = utils_1.adaptTrackedData(docJSONed);
        const modelsFromPM = manuscript_transform_1.encode(manuscript_transform_1.schema.nodeFromJSON(docClean));
        // adding supplements from final model map as they are meta (not PM presentable)
        finalModelMap.forEach((model) => {
            if (model.objectType === manuscripts_json_schema_1.ObjectTypes.Supplement) {
                modelsFromPM.set(model._id, model);
            }
        });
        return replace_attachments_ids_1.replaceAttachmentLinks(modelsFromPM, getAttachments());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doc, finalModelMap]);
    const [, dispatchStore] = store_1.useStore();
    const matchByTrackVersion = (node, realId, trackedId) => {
        if (node.attrs.dataTracked && realId === node.attrs.id) {
            const matchedTrackedId = node.attrs.dataTracked.find((tracked) => tracked.id === trackedId);
            return matchedTrackedId ? true : false;
            // check and identify precise dataTracked version
        }
    };
    const saveTrackModel = react_1.useCallback((model) => {
        var _a;
        if (model._id) {
            const currentModel = modelMap.get(model._id);
            if (currentModel) {
                modelMap.set(model._id, Object.assign(Object.assign({}, currentModel), model));
            }
            else {
                modelMap.set(model._id, model);
            }
            let foundInDoc = false;
            let dataTrackedId = '';
            if ((_a = model._id) === null || _a === void 0 ? void 0 : _a.includes(utils_1.trackedJoint)) {
                // when encoding we modify ids of track changes artefacts to avoid duplicate ids in the modelMap
                // when saving back we need to convert those ids back and also apply the updates on the right nodes
                const base = model._id.split(utils_1.trackedJoint);
                dataTrackedId = base[1];
                model._id = base[0];
            }
            const attachmentLinksModelMap = replace_attachments_ids_1.replaceAttachmentsIds(modelMap, getAttachments());
            if (view) {
                doc.descendants((node, pos) => {
                    if (node.attrs.id === model._id ||
                        matchByTrackVersion(node, model._id || '', dataTrackedId)) {
                        const decoder = new manuscript_transform_1.Decoder(attachmentLinksModelMap, true); // as node ids are unique it will always occur just once (or never) so it's safe to keep in the loop
                        const newDoc = decoder.createArticleNode();
                        newDoc.descendants((newNode, pos) => {
                            var _a;
                            if (newNode.attrs.id === node.attrs.id ||
                                matchByTrackVersion(node, ((_a = newNode.attrs.id) === null || _a === void 0 ? void 0 : _a.split(utils_1.trackedJoint)[0]) || '', dataTrackedId)) {
                                node_attrs_1.setNodeAttrs(view.state, view.dispatch, node.attrs.id, newNode.attrs);
                            }
                        });
                        foundInDoc = true;
                    }
                });
            }
            if (!foundInDoc) {
                // ...that is if there is no node in the prosemirror doc for that id, that update final model. This is needed until we implement tracking on metadata
                saveModel(model);
            }
        }
        return Promise.resolve(model);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelMap, saveModel, doc, view]);
    const deleteTrackModel = react_1.useCallback((id) => {
        if (modelMap.has(id)) {
            modelMap.delete(id);
            doc.descendants((node, pos) => {
                if (node.attrs.id === id) {
                    const { tr } = state;
                    tr.delete(pos, pos + node.nodeSize);
                    dispatch(tr);
                    dispatchStore({ trackModelMap: modelMap });
                }
            });
        }
        else {
            deleteModel(id);
        }
        return Promise.resolve(id);
    }, [dispatch, dispatchStore, deleteModel, doc, modelMap, state] // will loop rerenders probably because of modelMap
    );
    const getTrackModel = react_1.useCallback((id) => modelMap.get(id), [
        modelMap,
    ]);
    return {
        saveTrackModel,
        deleteTrackModel,
        trackModelMap: modelMap,
        getTrackModel,
    };
};
exports.default = useTrackedModelManagement;
//# sourceMappingURL=use-tracked-model-management.js.map