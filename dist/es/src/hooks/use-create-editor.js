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
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_router_1 = require("react-router");
const CitationEditor_1 = __importDefault(require("../components/library/CitationEditor"));
const CitationViewer_1 = require("../components/library/CitationViewer");
const ReferencesViewer_1 = require("../components/library/ReferencesViewer");
const config_1 = __importDefault(require("../config"));
const lean_workflow_gql_1 = require("../lib/lean-workflow-gql");
const store_1 = require("../store");
const theme_1 = require("../theme/theme");
const ThemeProvider_1 = require("../theme/ThemeProvider");
const useCreateEditor = (permissions) => {
    const [{ doc, ancestorDoc, manuscript, project, user, biblio, modelMap, getModel, saveModel, deleteModel, commitAtLoad, submissionId, },] = store_1.useStore((store) => ({
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
        putAttachment: store.putAttachment,
        submissionId: store.submissionID || '',
        commitAtLoad: store.commitAtLoad,
    }));
    const can = style_guide_1.usePermissions();
    const popper = react_1.useRef(new manuscript_editor_1.PopperManager());
    const { uploadAttachment } = lean_workflow_gql_1.useUploadAttachment();
    const putAttachment = (file, designation = 'supplementary') => {
        return uploadAttachment({
            submissionId,
            file: file,
            designation: designation,
        })
            .then(({ data }) => {
            var _a;
            return (_a = data.uploadAttachment) === null || _a === void 0 ? void 0 : _a.link;
        })
            .catch((e) => {
            console.error(e);
            return null;
        });
    };
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
    const files = manuscript_transform_1.getModelsByType(modelMap, manuscripts_json_schema_1.ObjectTypes.ExternalFile);
    const history = react_router_1.useHistory();
    const editorProps = Object.assign(Object.assign({ attributes: {
            class: 'manuscript-editor',
            lang: 'en-GB',
            spellcheck: 'true',
            tabindex: '2',
        }, doc, locale: manuscript.primaryLanguageCode || 'en-GB', permissions: permissions, environment: config_1.default.environment, history, jupyterConfig: config_1.default.jupyter, popper: popper.current, projectID: project._id }, biblio), { 
        // model and attachment retrieval:
        modelMap, getManuscript: () => manuscript, getCurrentUser: () => user, getModel,
        saveModel,
        deleteModel, putAttachment: putAttachment, retrySync, renderReactComponent: (child, container) => {
            if (child && typeof child !== 'boolean') {
                react_dom_1.default.render(react_1.default.createElement(ThemeProvider_1.ThemeProvider, null, child), container);
            }
        }, unmountReactComponent: react_dom_1.default.unmountComponentAtNode, components: {
            ReferencesViewer: ReferencesViewer_1.ReferencesViewer,
            CitationEditor: CitationEditor_1.default,
            CitationViewer: CitationViewer_1.CitationViewer,
        }, ancestorDoc: ancestorDoc, commit: commitAtLoad || null, externalFiles: files, theme: theme_1.theme,
        submissionId, capabilities: can, 
        // TODO:: remove this as we are not going to use designation
        updateDesignation: () => new Promise(() => false), uploadAttachment: (designation, file) => putAttachment(file, designation) });
    const editor = manuscript_editor_1.useEditor(manuscript_editor_1.ManuscriptsEditor.createState(editorProps), manuscript_editor_1.ManuscriptsEditor.createView(editorProps));
    return editor;
};
exports.useCreateEditor = useCreateEditor;
//# sourceMappingURL=use-create-editor.js.map