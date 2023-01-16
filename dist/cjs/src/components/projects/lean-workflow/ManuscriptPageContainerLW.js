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
require("@manuscripts/manuscript-editor/styles/track-styles.css");
require("@manuscripts/manuscript-editor/styles/popper.css");
require("@reach/tabs/styles.css");
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../../config"));
const use_create_editor_1 = require("../../../hooks/use-create-editor");
const use_tracked_model_management_1 = __importDefault(require("../../../hooks/use-tracked-model-management"));
const lean_workflow_gql_1 = require("../../../lib/lean-workflow-gql");
const useCommentStore_1 = require("../../../quarterback/useCommentStore");
const useDocStore_1 = require("../../../quarterback/useDocStore");
const store_1 = require("../../../store");
const MetadataContainer_1 = __importDefault(require("../../metadata/MetadataContainer"));
const Page_1 = require("../../Page");
const Placeholders_1 = require("../../Placeholders");
const useEditorStore_1 = require("../../track-changes/useEditorStore");
const EditorContainer_1 = require("../EditorContainer");
const ManuscriptSidebar_1 = __importDefault(require("../ManuscriptSidebar"));
const ReloadDialog_1 = require("../ReloadDialog");
const ApplicationMenusLW_1 = require("./ApplicationMenusLW");
const EditorElement_1 = __importDefault(require("./EditorElement"));
const Inspector_1 = __importDefault(require("./Inspector"));
const UserProvider_1 = require("./provider/UserProvider");
const TrackChangesStyles_1 = require("./TrackChangesStyles");
const ManuscriptPageContainer = () => {
    var _a;
    const [{ project, user, submission, person }, dispatch] = store_1.useStore((state) => {
        return {
            manuscriptID: state.manuscriptID,
            project: state.project,
            user: state.user,
            submission: state.submission,
            person: state.person,
        };
    });
    react_1.useEffect(() => {
        if ((submission === null || submission === void 0 ? void 0 : submission.id) && person) {
            dispatch({
                submission: submission,
                submissionId: submission.id,
                lwUser: person,
            });
        }
    }, [submission, person, dispatch]);
    const submissionId = submission === null || submission === void 0 ? void 0 : submission.id;
    const permittedActionsData = lean_workflow_gql_1.useGetPermittedActions(submissionId);
    const permittedActions = (_a = permittedActionsData === null || permittedActionsData === void 0 ? void 0 : permittedActionsData.data) === null || _a === void 0 ? void 0 : _a.permittedActions;
    // lwRole must not be used to calculate permissions in the contenxt of manuscripts app.
    // lwRole is only for the dashboard
    const can = style_guide_1.useCalcPermission({
        profile: user,
        project: project,
        permittedActions,
    });
    if (permittedActionsData.loading) {
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
    if (permittedActionsData.error) {
        const message = lean_workflow_gql_1.graphQLErrorMessage(permittedActionsData.error, 'Request for user permissions from server failed.');
        return react_1.default.createElement(ReloadDialog_1.ReloadDialog, { message: message });
    }
    return (react_1.default.createElement(style_guide_1.CapabilitiesProvider, { can: can },
        react_1.default.createElement(ManuscriptPageView, null)));
};
const ManuscriptPageView = () => {
    const [manuscript] = store_1.useStore((store) => store.manuscript);
    const [project] = store_1.useStore((store) => store.project);
    const [user] = store_1.useStore((store) => store.user);
    const [lwUser] = store_1.useStore((store) => store.lwUser);
    const [modelMap] = store_1.useStore((store) => store.modelMap);
    const [submissionID] = store_1.useStore((store) => store.submissionID || '');
    const [manuscriptID, storeDispatch, getState] = store_1.useStore((store) => store.manuscriptID);
    const [doc] = store_1.useStore((store) => store.doc);
    const [saveModel] = store_1.useStore((store) => store.saveModel);
    const [deleteModel] = store_1.useStore((store) => store.deleteModel);
    const [collaboratorsById] = store_1.useStore((store) => store.collaboratorsById || new Map());
    const can = style_guide_1.usePermissions();
    const editor = use_create_editor_1.useCreateEditor();
    const { state, dispatch, view } = editor;
    const { saveTrackModel, trackModelMap, deleteTrackModel, getTrackModel, } = use_tracked_model_management_1.default(doc, view, state, dispatch, saveModel, deleteModel, modelMap, () => getState().submission.attachments);
    react_1.useEffect(() => {
        storeDispatch({
            saveTrackModel,
            trackModelMap,
            deleteTrackModel,
            getTrackModel,
        });
    }, [
        saveTrackModel,
        trackModelMap,
        deleteTrackModel,
        storeDispatch,
        getTrackModel,
    ]);
    react_1.useEffect(() => {
        // Please note that using prosemirror-dev-toolkit may result in incosistent behaviour with from production
        // for example any dispatch that you pass to the editor props will be replaced with a dispatch from the dev-toolkit
        if (view && config_1.default.environment === 'development') {
            Promise.resolve().then(() => __importStar(require('prosemirror-dev-toolkit'))).then(({ applyDevTools }) => applyDevTools(view))
                .catch((error) => {
                console.error('There was an error loading prosemirror-dev-toolkit', error.message);
            });
        }
    }, [view]);
    const { setUsers } = useCommentStore_1.useCommentStore();
    const { updateDocument } = useDocStore_1.useDocStore();
    const { init: initEditor, setEditorState, trackState } = useEditorStore_1.useEditorStore();
    react_1.useEffect(() => setUsers(collaboratorsById), [collaboratorsById, setUsers]);
    react_1.useEffect(() => view && initEditor(view), [view, initEditor]);
    const hasPendingSuggestions = react_1.useMemo(() => {
        const { changeSet } = trackState || {};
        return changeSet && changeSet.pending.length > 0;
    }, [trackState]);
    react_1.useEffect(() => {
        storeDispatch({ hasPendingSuggestions });
    }, [storeDispatch, hasPendingSuggestions]);
    const saveDocument = lodash_debounce_1.default((state) => {
        storeDispatch({ doc: state.doc });
        updateDocument(manuscriptID, state.doc.toJSON());
    }, 500);
    react_1.useEffect(() => {
        const { trackState } = setEditorState(state);
        if (trackState && trackState.status !== track_changes_plugin_1.TrackChangesStatus.viewSnapshots) {
            saveDocument(state);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    const TABS = [
        'Content',
        // (config.features.commenting || config.features.productionNotes) &&
        'Comments',
        config_1.default.features.qualityControl && 'Quality',
        config_1.default.quarterback.enabled && 'History',
        config_1.default.features.fileManagement && 'Files',
    ].filter(Boolean);
    return (react_1.default.createElement(manuscript_editor_1.RequirementsProvider, { modelMap: modelMap },
        react_1.default.createElement(UserProvider_1.UserProvider, { lwUser: lwUser, manuscriptUser: user, submissionId: submissionID },
            react_1.default.createElement(ManuscriptSidebar_1.default, { project: project, manuscript: manuscript, view: view, state: state, user: user }),
            react_1.default.createElement(PageWrapper, null,
                react_1.default.createElement(Page_1.Main, null,
                    react_1.default.createElement(EditorContainer_1.EditorContainer, null,
                        react_1.default.createElement(EditorContainer_1.EditorContainerInner, null,
                            react_1.default.createElement(EditorContainer_1.EditorHeader, null,
                                react_1.default.createElement(ApplicationMenusLW_1.ApplicationMenuContainer, null,
                                    react_1.default.createElement(ApplicationMenusLW_1.ApplicationMenusLW, { editor: editor, contentEditable: can.editArticle })),
                                can.seeEditorToolbar && (react_1.default.createElement(manuscript_editor_1.ManuscriptToolbar, { state: state, can: can, dispatch: dispatch, footnotesEnabled: config_1.default.features.footnotes, view: view }))),
                            react_1.default.createElement(EditorContainer_1.EditorBody, null,
                                react_1.default.createElement(MetadataContainer_1.default, { handleTitleStateChange: () => '' /*FIX THIS*/, allowInvitingAuthors: false, showAuthorEditButton: true, disableEditButton: !can.editMetadata }),
                                react_1.default.createElement(TrackChangesStyles_1.TrackChangesStyles, null,
                                    react_1.default.createElement(EditorElement_1.default, { editor: editor })))))),
                react_1.default.createElement(Inspector_1.default, { tabs: TABS, editor: editor })))));
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