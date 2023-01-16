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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const use_requirements_validation_1 = require("../../../hooks/use-requirements-validation");
const store_1 = require("../../../store");
const Panel_1 = __importDefault(require("../../Panel"));
const RequirementsInspector_1 = require("../../requirements/RequirementsInspector");
const ResizerButtons_1 = require("../../ResizerButtons");
const TrackChangesPanel_1 = require("../../track-changes/TrackChangesPanel");
const InspectorLW_1 = require("../InspectorLW");
const CommentsTab_1 = require("./CommentsTab");
const ContentTab_1 = require("./ContentTab");
const Inspector = ({ tabs, editor }) => {
    const [{ submissionId, submission, fileManagement, commentTarget, saveTrackModel, trackModelMap, }, stateDispatch,] = store_1.useStore((store) => ({
        saveTrackModel: store.saveTrackModel,
        trackModelMap: store.trackModelMap,
        submissionId: store.submissionID,
        submission: store.submission,
        fileManagement: store.fileManagement,
        commentTarget: store.commentTarget,
    }));
    const { state, dispatch, view } = editor;
    const validation = use_requirements_validation_1.useRequirementsValidation({
        state,
    });
    const selected = react_1.useMemo(() => state && manuscript_editor_1.findParentNodeWithIdValue(state.selection), [state]);
    const can = style_guide_1.usePermissions();
    const modelIds = trackModelMap ? Array.from(trackModelMap === null || trackModelMap === void 0 ? void 0 : trackModelMap.keys()) : [];
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Panel_1.default, { name: 'inspector', minSize: 400, direction: 'row', side: 'start', hideWhen: 'max-width: 900px', resizerButton: ResizerButtons_1.ResizingInspectorButton, forceOpen: commentTarget !== undefined },
            react_1.default.createElement(InspectorLW_1.Inspector, { tabs: tabs, commentTarget: commentTarget }, tabs.map((label) => {
                switch (label) {
                    case 'Content': {
                        return (react_1.default.createElement(ContentTab_1.ContentTab, { selected: selected, selectedElement: manuscript_editor_1.findParentElement(state.selection, modelIds), selectedSection: manuscript_editor_1.findParentSection(state.selection), state: state, dispatch: dispatch, hasFocus: view === null || view === void 0 ? void 0 : view.hasFocus(), key: "content" }));
                    }
                    case 'Comments': {
                        return react_1.default.createElement(CommentsTab_1.CommentsTab, { editor: editor, key: "comments" });
                    }
                    case 'Quality': {
                        return (react_1.default.createElement(RequirementsInspector_1.RequirementsInspectorView, { key: "quality", result: validation.result, error: validation.error, isBuilding: validation.isBuilding }));
                    }
                    case 'History': {
                        return react_1.default.createElement(TrackChangesPanel_1.TrackChangesPanel, { key: "track-changes" });
                    }
                    case 'Files': {
                        return submissionId ? (react_1.default.createElement(style_guide_1.FileManager, { key: "files", can: can, enableDragAndDrop: true, modelMap: trackModelMap, 
                            // @ts-ignore
                            saveModel: saveTrackModel, fileManagement: Object.assign(Object.assign({}, fileManagement), { getAttachments: () => submission.attachments }), addAttachmentToState: (attachment) => stateDispatch({
                                submission: Object.assign(Object.assign({}, submission), { attachments: [...submission.attachments, attachment] }),
                            }) })) : null;
                    }
                }
            })))));
};
exports.default = Inspector;
//# sourceMappingURL=Inspector.js.map