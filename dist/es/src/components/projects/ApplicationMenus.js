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
exports.ManuscriptPageMenus = exports.createMenuSpec = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const react_1 = __importStar(require("react"));
const config_1 = __importDefault(require("../../config"));
const use_crisp_1 = require("../../hooks/use-crisp");
const colors_1 = require("../../lib/colors");
const native_1 = require("../../lib/native");
const project_menu_1 = require("../../lib/project-menu");
const createMenuSpec = (props, openDialog, openChat) => {
    const { view } = props;
    const { state, dispatch } = view;
    const doCommand = (command) => command(state, dispatch);
    const isCommandValid = (command) => !!command(state);
    const developMenu = {
        id: 'develop',
        label: 'Develop',
        submenu: [
            {
                id: 'import',
                label: 'Import Manuscript…',
                run: props.openImporter,
            },
        ],
    };
    const helpMenu = {
        id: 'help',
        label: 'Help',
        submenu: [
            {
                id: 'community',
                label: 'Community',
                run: () => window.open('https://community.manuscripts.io/'),
            },
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
                run: () => props.history.push(`/projects/${props.project._id}/diagnostics`),
            },
        ],
    };
    if (config_1.default.crisp.id) {
        helpMenu.submenu.push({
            role: 'separator',
        }, {
            id: 'support',
            label: 'Support',
            run: () => openChat(),
        });
    }
    const menu = [
        project_menu_1.buildProjectMenu(props),
        ...manuscript_editor_1.getMenus({
            state,
            doCommand,
            isCommandValid,
        }, openDialog, config_1.default.features.footnotes),
        helpMenu,
    ];
    if (!config_1.default.production) {
        menu.push(developMenu);
    }
    return menu;
};
exports.createMenuSpec = createMenuSpec;
const ManuscriptPageMenus = (props) => {
    const [dialog, setDialog] = react_1.useState(null);
    const closeDialog = () => setDialog(null);
    const openDialog = (dialog) => setDialog(dialog);
    const { colors, colorScheme } = colors_1.buildColors(props.modelMap);
    const handleAddColor = colors_1.addColor(colors, props.saveModel, colorScheme);
    const crisp = use_crisp_1.useCrisp();
    const openChat = crisp.open;
    const spec = exports.createMenuSpec(props, openDialog, openChat);
    react_1.useEffect(() => {
        window.dispatchMenuAction = native_1.createDispatchMenuAction(spec);
        window.getMenuState = () => spec;
    }, [spec]);
    const { menuState, wrapperRef, handleItemClick } = manuscript_editor_1.useApplicationMenus(spec);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(manuscript_editor_1.DialogController, { currentDialog: dialog, handleCloseDialog: closeDialog, editorState: props.view.state, dispatch: props.view.dispatch, colors: colors, handleAddColor: handleAddColor }),
        react_1.default.createElement(manuscript_editor_1.ApplicationMenus, { menuState: menuState, wrapperRef: wrapperRef, handleItemClick: handleItemClick })));
};
exports.ManuscriptPageMenus = ManuscriptPageMenus;
//# sourceMappingURL=ApplicationMenus.js.map