"use strict";
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
exports.useCreateEditor = void 0;
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
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_router_1 = require("react-router");
const CitationEditor_1 = __importDefault(require("../components/library/CitationEditor"));
const CitationViewer_1 = require("../components/library/CitationViewer");
const ReferencesViewer_1 = require("../components/library/ReferencesViewer");
const config_1 = __importDefault(require("../config"));
// import { useUploadAttachment } from '../lib/lean-workflow-gql'
const useAuthStore_1 = require("../quarterback/useAuthStore");
const store_1 = require("../store");
const theme_1 = require("../theme/theme");
const ThemeProvider_1 = require("../theme/ThemeProvider");
const useCreateEditor = () => {
    const [{ doc, ancestorDoc, manuscript, project, user, biblio, modelMap, getModel, saveModel, deleteModel, commitAtLoad, submissionId, submission, fileManagement, }, dispatch, getState,] = store_1.useStore((store) => ({
        doc: store.doc,
        ancestorDoc: store.ancestorDoc,
        manuscript: store.manuscript,
        project: store.project,
        user: store.user,
        biblio: store.biblio,
        modelMap: store.modelMap,
        getModel: store.getModel,
        saveModel: store.saveModel,
        deleteModel: store.deleteModel,
        submissionId: store.submissionID || '',
        commitAtLoad: store.commitAtLoad,
        submission: store.submission,
        fileManagement: store.fileManagement,
    }));
    const { user: trackUser } = useAuthStore_1.useAuthStore();
    const can = style_guide_1.usePermissions();
    const popper = react_1.useRef(new manuscript_editor_1.PopperManager());
    const retrySync = (componentIDs) => {
        componentIDs.forEach((id) => {
            const model = getModel(id);
            if (!model) {
                return;
            }
            saveModel(model);
        });
        return Promise.resolve();
    };
    const history = react_router_1.useHistory();
    const editorProps = Object.assign(Object.assign({ attributes: {
            class: 'manuscript-editor',
            lang: 'en-GB',
            spellcheck: 'true',
            tabindex: '2',
        }, doc, plugins: config_1.default.quarterback.enabled
            ? [
                track_changes_plugin_1.trackChangesPlugin({
                    userID: trackUser.id,
                    debug: config_1.default.environment === 'development',
                }),
            ]
            : [], locale: manuscript.primaryLanguageCode || 'en-GB', environment: config_1.default.environment, history, jupyterConfig: config_1.default.jupyter, popper: popper.current, projectID: project._id }, biblio), { 
        // model and attachment retrieval:
        modelMap, getManuscript: () => manuscript, getCurrentUser: () => user, setCommentTarget: (target) => dispatch({ commentTarget: target }), setSelectedComment: (commentId) => dispatch({ selectedComment: commentId }), getModel, saveModel: function (model) {
            /*
            Models plugin in the prosemirror-editor calls saveModel when there is a change on a model (aux objects, citations, references),
            but only if requested in a transaction so it happens only in a couple of cases.
            This shouldn't be happening with the track-changes enabled. With the way things are currently,
            we might need to implement filtering to avoid updates on the models that are trackable with track-changes.
            Once metadata are trackable saveModel (for final modelMap) shouldn't be available to the editor at all.
            */
            return saveModel(model);
        }, deleteModel,
        retrySync, renderReactComponent: (child, container) => {
            if (child && typeof child !== 'boolean') {
                react_dom_1.default.render(react_1.default.createElement(ThemeProvider_1.ThemeProvider, null, child), container);
            }
        }, unmountReactComponent: react_dom_1.default.unmountComponentAtNode, components: {
            ReferencesViewer: ReferencesViewer_1.ReferencesViewer,
            CitationEditor: CitationEditor_1.default,
            CitationViewer: CitationViewer_1.CitationViewer,
        }, ancestorDoc: ancestorDoc, commit: commitAtLoad || null, theme: theme_1.theme,
        submissionId, capabilities: can, 
        // TODO:: remove this as we are not going to use designation
        updateDesignation: () => new Promise(() => false), uploadAttachment: (designation, file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield fileManagement.upload(file, designation);
            if (typeof result === 'object') {
                dispatch({
                    submission: Object.assign(Object.assign({}, submission), { attachments: [
                            ...submission.attachments,
                            Object.assign({}, result),
                        ] }),
                });
                return result;
            }
        }), getAttachments: () => {
            return getState().submission.attachments;
        } });
    const editor = manuscript_editor_1.useEditor(manuscript_editor_1.ManuscriptsEditor.createState(editorProps), manuscript_editor_1.ManuscriptsEditor.createView(editorProps));
    return editor;
};
exports.useCreateEditor = useCreateEditor;
//# sourceMappingURL=use-create-editor.js.map