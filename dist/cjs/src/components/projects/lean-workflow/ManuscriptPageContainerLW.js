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
require("@manuscripts/manuscript-editor/styles/Editor.css");
require("@manuscripts/manuscript-editor/styles/LeanWorkflow.css");
require("@manuscripts/manuscript-editor/styles/popper.css");
require("@reach/tabs/styles.css");
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../../config"));
const use_commits_1 = require("../../../hooks/use-commits");
const use_create_editor_1 = require("../../../hooks/use-create-editor");
const lean_workflow_gql_1 = require("../../../lib/lean-workflow-gql");
const roles_1 = require("../../../lib/roles");
const store_1 = require("../../../store");
const MetadataContainer_1 = __importDefault(require("../../metadata/MetadataContainer"));
const Page_1 = require("../../Page");
const Placeholders_1 = require("../../Placeholders");
const EditorContainer_1 = require("../EditorContainer");
const ManuscriptSidebar_1 = __importDefault(require("../ManuscriptSidebar"));
const ReloadDialog_1 = require("../ReloadDialog");
const ApplicationMenusLW_1 = require("./ApplicationMenusLW");
const EditorElement_1 = __importDefault(require("./EditorElement"));
const Inspector_1 = __importDefault(require("./Inspector"));
const ManualFlowTransitioning_1 = require("./ManualFlowTransitioning");
const UserProvider_1 = require("./provider/UserProvider");
const SaveStatusController_1 = require("./SaveStatusController");
const TrackChangesStyles_1 = require("./TrackChangesStyles");
const ManuscriptPageContainer = () => {
    var _a, _b, _c, _d, _e;
    const [{ manuscriptID, project, user }, dispatch] = store_1.useStore((state) => {
        return {
            manuscriptID: state.manuscriptID,
            project: state.project,
            user: state.user,
        };
    });
    const submissionData = lean_workflow_gql_1.useGetSubmissionAndPerson(manuscriptID, project._id);
    react_1.useEffect(() => {
        var _a, _b, _c;
        if (((_b = (_a = submissionData === null || submissionData === void 0 ? void 0 : submissionData.data) === null || _a === void 0 ? void 0 : _a.submission) === null || _b === void 0 ? void 0 : _b.id) && ((_c = submissionData === null || submissionData === void 0 ? void 0 : submissionData.data) === null || _c === void 0 ? void 0 : _c.person)) {
            dispatch({
                submission: submissionData.data.submission,
                submissionId: submissionData.data.submission.id,
                lwUser: submissionData.data.person,
            });
        }
    }, [submissionData, dispatch]);
    const submissionId = (_b = (_a = submissionData === null || submissionData === void 0 ? void 0 : submissionData.data) === null || _a === void 0 ? void 0 : _a.submission) === null || _b === void 0 ? void 0 : _b.id;
    const permittedActionsData = lean_workflow_gql_1.useGetPermittedActions(submissionId);
    const permittedActions = (_c = permittedActionsData === null || permittedActionsData === void 0 ? void 0 : permittedActionsData.data) === null || _c === void 0 ? void 0 : _c.permittedActions;
    // lwRole must not be used to calculate permissions in the contenxt of manuscripts app.
    // lwRole is only for the dashboard
    const can = style_guide_1.useCalcPermission({
        profile: user,
        project: project,
        permittedActions,
    });
    if (submissionData.loading || permittedActionsData.loading) {
        return react_1.default.createElement(Placeholders_1.ManuscriptPlaceholder, null);
    }
    // else if (error || !data) {
    //   return (
    //     <UserProvider
    //       lwUser={lwUser}
    //       manuscriptUser={props.user}
    //       submissionId={submissionId}
    //     >
    //       <ExceptionDialog errorCode={'MANUSCRIPT_ARCHIVE_FETCH_FAILED'} />
    //     </UserProvider>
    //   )
    // }
    if (submissionData.error || permittedActionsData.error) {
        const networkError = ((_d = submissionData.error) === null || _d === void 0 ? void 0 : _d.networkError) ||
            ((_e = permittedActionsData.error) === null || _e === void 0 ? void 0 : _e.networkError);
        const message = networkError
            ? 'Trouble reaching lean server. Please try again.'
            : submissionData.error
                ? 'Request for project submission from server failed.'
                : 'Request for user permissions from server failed.';
        return react_1.default.createElement(ReloadDialog_1.ReloadDialog, { message: message });
    }
    return (react_1.default.createElement(style_guide_1.CapabilitiesProvider, { can: can },
        react_1.default.createElement(ManuscriptPageView, null)));
};
const ManuscriptPageView = (props) => {
    const [manuscript] = store_1.useStore((store) => store.manuscript);
    const [project] = store_1.useStore((store) => store.project);
    const [user] = store_1.useStore((store) => store.user);
    const [snapshotID] = store_1.useStore((store) => store.snapshotID);
    const [lwUser] = store_1.useStore((store) => store.lwUser);
    const [modelMap] = store_1.useStore((store) => store.modelMap);
    const [submissionID] = store_1.useStore((store) => store.submissionID);
    const [submission] = store_1.useStore((store) => store.submission);
    const submissionId = submissionID || '';
    const can = style_guide_1.usePermissions();
    const permissions = { write: !roles_1.isViewer(project, user.userID) };
    const editor = use_create_editor_1.useCreateEditor(permissions);
    const { state, dispatch, view } = editor;
    // useChangeReceiver(editor, saveModel, deleteModel) - not needed under new architecture
    const [sortBy] = store_1.useStore((store) => store.commmitsSortBy || 'Date');
    const { commits, corrections, accept, reject, isDirty } = use_commits_1.useCommits({
        editor,
        sortBy,
    });
    const hasPendingSuggestions = react_1.useMemo(() => {
        for (const { status } of corrections) {
            const { label } = status;
            if (label === 'proposed') {
                return true;
            }
        }
        return false;
    }, [corrections]);
    const TABS = [
        'Content',
        (config_1.default.features.commenting || config_1.default.features.productionNotes) &&
            'Comments',
        config_1.default.features.qualityControl && 'Quality',
        config_1.default.shackles.enabled && 'History',
        config_1.default.features.fileManagement && 'Files',
    ].filter(Boolean);
    return (react_1.default.createElement(manuscript_editor_1.RequirementsProvider, { modelMap: modelMap },
        react_1.default.createElement(UserProvider_1.UserProvider, { lwUser: lwUser, manuscriptUser: user, submissionId: submissionId },
            !config_1.default.leanWorkflow.enabled && (react_1.default.createElement(ManuscriptSidebar_1.default, { project: project, manuscript: manuscript, view: view, state: state, permissions: permissions, user: user })),
            react_1.default.createElement(PageWrapper, null,
                react_1.default.createElement(Page_1.Main, null,
                    react_1.default.createElement(EditorContainer_1.EditorContainer, null,
                        react_1.default.createElement(EditorContainer_1.EditorContainerInner, null,
                            (submission === null || submission === void 0 ? void 0 : submission.nextStep) && (react_1.default.createElement(ManualFlowTransitioning_1.ManualFlowTransitioning, { submission: submission, userRole: roles_1.getUserRole(project, user.userID), documentId: `${project._id}#${manuscript._id}`, hasPendingSuggestions: hasPendingSuggestions },
                                react_1.default.createElement(SaveStatusController_1.SaveStatusController, { isDirty: isDirty }))),
                            react_1.default.createElement(EditorContainer_1.EditorHeader, null,
                                react_1.default.createElement(ApplicationMenusLW_1.ApplicationMenuContainer, null,
                                    react_1.default.createElement(ApplicationMenusLW_1.ApplicationMenusLW, { editor: editor, contentEditable: permissions.write })),
                                can.seeEditorToolbar && (react_1.default.createElement(manuscript_editor_1.ManuscriptToolbar, { state: state, can: can, dispatch: dispatch, footnotesEnabled: config_1.default.features.footnotes, view: view }))),
                            react_1.default.createElement(EditorContainer_1.EditorBody, null,
                                react_1.default.createElement(MetadataContainer_1.default, { handleTitleStateChange: () => '' /*FIX THIS*/, permissions: permissions, allowInvitingAuthors: false, showAuthorEditButton: true, disableEditButton: roles_1.isViewer(project, user.userID) ||
                                        roles_1.isAnnotator(project, user.userID) }),
                                react_1.default.createElement(TrackChangesStyles_1.TrackChangesStyles, { enabled: !!snapshotID, readOnly: !can.handleSuggestion, rejectOnly: can.rejectOwnSuggestion, corrections: corrections },
                                    react_1.default.createElement(EditorElement_1.default, { editor: editor, accept: accept, reject: reject })))))),
                react_1.default.createElement(Inspector_1.default, { tabs: TABS, corrections: corrections, commits: commits, editor: editor, accept: accept, reject: reject })))));
};
const PageWrapper = styled_components_1.default.div `
  position: relative;
  display: flex;
  flex: 2;
  overflow: hidden;

  .edit_authors_button {
    display: initial;
    color: ${(props) => props.theme.colors.button.secondary.color.default};
    background: ${(props) => props.theme.colors.button.secondary.background.default};
    border-color: ${(props) => props.theme.colors.button.secondary.border.default};

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      color: ${(props) => props.theme.colors.button.secondary.color.hover};
      background: ${(props) => props.theme.colors.button.secondary.background.hover};
      border-color: ${(props) => props.theme.colors.button.secondary.border.hover};
    }
  }
`;
exports.default = ManuscriptPageContainer;
//# sourceMappingURL=ManuscriptPageContainerLW.js.map