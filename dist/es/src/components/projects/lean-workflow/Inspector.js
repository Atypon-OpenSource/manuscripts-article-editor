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
const use_comments_1 = require("../../../hooks/use-comments");
const use_requirements_validation_1 = require("../../../hooks/use-requirements-validation");
const store_1 = require("../../../store");
const SnapshotsDropdown_1 = require("../../inspector/SnapshotsDropdown");
const Panel_1 = __importDefault(require("../../Panel"));
const RequirementsInspector_1 = require("../../requirements/RequirementsInspector");
const ResizerButtons_1 = require("../../ResizerButtons");
const Corrections_1 = require("../../track/Corrections");
const SortByDropdown_1 = require("../../track/SortByDropdown");
const InspectorLW_1 = require("../InspectorLW");
const CommentsTab_1 = require("./CommentsTab");
const ContentTab_1 = require("./ContentTab");
const ErrorDialog_1 = require("./ErrorDialog");
const ExceptionDialog_1 = require("./ExceptionDialog");
const FileHandling_1 = __importDefault(require("./FileHandling"));
const Inspector = ({ tabs, commits, editor, corrections, accept, reject, }) => {
    const [{ snapshots, modelMap, user, project, manuscript, submissionId, submission, fileManagementErrors, commitsSortBy, comments, snapshotID, }, dispatchStore,] = store_1.useStore((store) => ({
        snapshots: store.snapshots,
        modelMap: store.modelMap,
        manuscript: store.manuscript,
        user: store.user,
        project: store.project,
        submissionId: store.submissionID,
        submission: store.submission,
        snapshotID: store.snapshotID,
        fileManagementErrors: store.fileManagementErrors || [],
        commitsSortBy: store.commitsSortBy,
        comments: store.comments || [],
    }));
    const { handleChangeAttachmentDesignation, handleReplaceAttachment, handleUploadAttachment, } = FileHandling_1.default();
    const { state, dispatch, view } = editor;
    const [header] = store_1.useStore((store) => store.errorDialogHeader || '');
    const [message] = store_1.useStore((store) => store.errorDialogMessage || '');
    const [showErrorDialog] = store_1.useStore((store) => store.showErrorDialog || false);
    const validation = use_requirements_validation_1.useRequirementsValidation({
        state,
    });
    const selected = manuscript_editor_1.findParentNodeWithIdValue(state.selection);
    const can = style_guide_1.usePermissions();
    const [errorDialog, setErrorDialog] = react_1.useState(false);
    const [selectedSnapshot, selectSnapshot] = react_1.useState(snapshots && snapshots[0]);
    const handleSelect = react_1.useCallback((snapshot) => {
        selectSnapshot(snapshot);
    }, []);
    const handleSort = (event) => {
        dispatchStore({
            commitsSortBy: event.currentTarget.value,
        });
    };
    const handleDownloadAttachment = react_1.useCallback((url) => {
        window.location.assign(url);
    }, []);
    const commentController = use_comments_1.useComments(comments, user, state, editor.doCommand);
    const modelIds = modelMap ? Array.from(modelMap === null || modelMap === void 0 ? void 0 : modelMap.keys()) : [];
    return (react_1.default.createElement(Panel_1.default, { name: 'inspector', minSize: 400, direction: 'row', side: 'start', hideWhen: 'max-width: 900px', resizerButton: ResizerButtons_1.ResizingInspectorButton, forceOpen: !!use_comments_1.getUnsavedComment(commentController.items) },
        react_1.default.createElement(InspectorLW_1.Inspector, { tabs: tabs, commentTarget: use_comments_1.getUnsavedComment(commentController.items) || undefined }, tabs.map((label) => {
            switch (label) {
                case 'Content': {
                    return (react_1.default.createElement(ContentTab_1.ContentTab, { selected: selected, selectedElement: manuscript_editor_1.findParentElement(state.selection, modelIds), selectedSection: manuscript_editor_1.findParentSection(state.selection), state: state, dispatch: dispatch, hasFocus: view === null || view === void 0 ? void 0 : view.hasFocus(), key: "content" }));
                }
                case 'Comments': {
                    return (react_1.default.createElement(CommentsTab_1.CommentsTab, { commentController: commentController, selected: selected, key: "comments" }));
                }
                case 'Quality': {
                    return (react_1.default.createElement(RequirementsInspector_1.RequirementsInspectorView, { key: "quality", result: validation.result, error: validation.error }));
                }
                case 'History': {
                    return snapshotID ? (react_1.default.createElement(react_1.default.Fragment, { key: "history" },
                        selectedSnapshot && (react_1.default.createElement(SnapshotsDropdown_1.SnapshotsDropdown, { snapshots: snapshots || [], selectedSnapshot: selectedSnapshot, selectSnapshot: handleSelect, selectedSnapshotURL: `/projects/${project._id}/history/${selectedSnapshot.s3Id}/manuscript/${manuscript._id}` })),
                        react_1.default.createElement(SortByDropdown_1.SortByDropdown, { sortBy: commitsSortBy, handleSort: handleSort }),
                        react_1.default.createElement(Corrections_1.Corrections, { corrections: corrections, editor: editor, commits: commits, accept: accept, reject: reject }))) : (react_1.default.createElement("h3", { key: "history" }, "Tracking is off - create a Snapshot to get started"));
                }
                case 'Files': {
                    return submissionId ? (react_1.default.createElement(react_1.default.Fragment, null,
                        errorDialog && (react_1.default.createElement(ErrorDialog_1.ErrorDialog, { isOpen: showErrorDialog, header: header, message: message, handleOk: () => setErrorDialog(false) })),
                        react_1.default.createElement(style_guide_1.FileManager, { submissionId: submissionId, can: can, enableDragAndDrop: true, modelMap: modelMap, attachments: submission.attachments, handleChangeDesignation: handleChangeAttachmentDesignation, handleDownload: handleDownloadAttachment, handleReplace: handleReplaceAttachment, handleUpload: handleUploadAttachment }),
                        fileManagementErrors.forEach((error) => error && react_1.default.createElement(ExceptionDialog_1.ExceptionDialog, { errorCode: error })))) : null;
                }
            }
        }))));
};
exports.default = Inspector;
//# sourceMappingURL=Inspector.js.map