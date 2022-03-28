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
exports.ApplicationMenusLW = exports.ApplicationMenuContainer = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const react_1 = __importStar(require("react"));
const react_router_1 = require("react-router");
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../../config"));
const bootstrap_manuscript_1 = require("../../../lib/bootstrap-manuscript");
const colors_1 = require("../../../lib/colors");
const project_menu_1 = require("../../../lib/project-menu");
const store_1 = require("../../../store");
const ModalHookableProvider_1 = require("../../ModalHookableProvider");
const Exporter_1 = require("../Exporter");
const Importer_1 = require("../Importer");
exports.ApplicationMenuContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ApplicationMenusLW = ({ editor, contentEditable, }) => {
    const [store] = store_1.useStore((store) => ({
        manuscriptID: store.manuscriptID,
        modelMap: store.modelMap,
        saveModel: store.saveModel,
        manuscripts: store.manuscripts,
        project: store.project,
        bulkCreate: store.bulkCreate,
        getAttachment: store.getAttachment,
    }));
    const history = react_router_1.useHistory();
    const { addModal } = ModalHookableProvider_1.useModal();
    const openImporter = () => {
        addModal('importer', ({ handleClose }) => (react_1.default.createElement(Importer_1.Importer, { handleComplete: handleClose, importManuscript: (models, redirect = true) => Importer_1.importManuscript(models, store.project._id, store.bulkCreate, history, store.manuscripts || [], redirect) })));
    };
    const openExporter = (format, closeOnSuccess) => {
        addModal('exporter', ({ handleClose }) => (react_1.default.createElement(Exporter_1.Exporter, { format: format, getAttachment: store.getAttachment, handleComplete: handleClose, modelMap: store.modelMap, manuscriptID: store.manuscriptID, project: store.project, closeOnSuccess: closeOnSuccess })));
    };
    const projectMenu = {
        id: 'project',
        label: 'Project',
        submenu: [
            project_menu_1.buildExportMenu(openExporter),
            project_menu_1.buildExportReferencesMenu(openExporter, editor.state),
            {
                role: 'separator',
            },
            {
                id: 'remaster',
                label: 'Remaster',
                run: () => bootstrap_manuscript_1.remaster(editor.state, store.modelMap, store.project, store.saveModel),
            },
        ],
    };
    const developMenu = {
        id: 'develop',
        label: 'Develop',
        submenu: [
            {
                id: 'import',
                label: 'Import Manuscript…',
                run: openImporter,
            },
        ],
    };
    const helpMenu = {
        id: 'help',
        label: 'Help',
        submenu: [
            {
                id: 'documentation',
                label: 'Documentation',
                run: () => window.open('https://support.manuscripts.io/'),
            },
            {
                role: 'separator',
            },
            {
                id: 'project-diagnostics',
                label: 'View Diagnostics',
                run: () => history.push(`/projects/${store.project._id}/diagnostics`),
            },
        ],
    };
    const [dialog, setDialog] = react_1.useState(null);
    const closeDialog = () => setDialog(null);
    const openDialog = (dialog) => setDialog(dialog);
    const { colors, colorScheme } = colors_1.buildColors(store.modelMap);
    const handleAddColor = colors_1.addColor(colors, store.saveModel, colorScheme);
    const menu = [
        projectMenu,
        ...manuscript_editor_1.getMenus(editor, openDialog, config_1.default.features.footnotes, contentEditable),
        helpMenu,
    ];
    if (!config_1.default.production) {
        menu.push(developMenu);
    }
    const menus = manuscript_editor_1.useApplicationMenus(menu);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(manuscript_editor_1.DialogController, { currentDialog: dialog, handleCloseDialog: closeDialog, colors: colors, handleAddColor: handleAddColor, editorState: editor.state, dispatch: editor.dispatch }),
        react_1.default.createElement(manuscript_editor_1.ApplicationMenus, Object.assign({}, menus))));
};
exports.ApplicationMenusLW = ApplicationMenusLW;
//# sourceMappingURL=ApplicationMenusLW.js.map