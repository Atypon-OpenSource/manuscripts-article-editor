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
exports.HistoricalManuscriptView = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const ThemeProvider_1 = require("../../theme/ThemeProvider");
const IntlProvider_1 = __importDefault(require("../IntlProvider"));
const EditorStyles_1 = require("../projects/EditorStyles");
const renderReactComponent = (child, container) => {
    react_dom_1.default.render(react_1.default.createElement(IntlProvider_1.default, null,
        react_1.default.createElement(ThemeProvider_1.ThemeProvider, null, child)), container);
};
const HistoricalManuscriptView = ({ currentSnapshot, project, manuscript, browserHistory, user, }) => {
    const modelMap = currentSnapshot.modelMap;
    const doc = currentSnapshot.doc;
    const [popper, setPopper] = react_1.useState();
    react_1.useEffect(() => {
        setPopper(new manuscript_editor_1.PopperManager());
    }, []);
    const getModel = react_1.useCallback((id) => {
        if (!modelMap) {
            return;
        }
        return modelMap.get(id);
    }, [modelMap]);
    const getManuscript = react_1.useCallback(() => manuscript, [manuscript]);
    const getCurrentUser = react_1.useCallback(() => user, [user]);
    const allAttachments = react_1.useCallback((id) => {
        if (!modelMap) {
            return Promise.resolve([]);
        }
        const model = modelMap.get(id);
        if (!model || !model.attachment) {
            return Promise.resolve([]);
        }
        return Promise.resolve([
            model.attachment,
        ]);
    }, [modelMap]);
    const locale = manuscript.primaryLanguageCode || 'en-GB';
    if (!modelMap || !doc || !popper) {
        return null;
    }
    return (react_1.default.createElement(EditorStyles_1.EditorStyles, { modelMap: modelMap },
        react_1.default.createElement(manuscript_editor_1.Viewer, { projectID: project._id, history: browserHistory, doc: doc, modelMap: modelMap, getModel: getModel, popper: popper, getManuscript: getManuscript, getLibraryItem: getModel, getCurrentUser: getCurrentUser, locale: locale, renderReactComponent: renderReactComponent, unmountReactComponent: react_dom_1.default.unmountComponentAtNode, allAttachments: allAttachments, components: {} })));
};
exports.HistoricalManuscriptView = HistoricalManuscriptView;
//# sourceMappingURL=HistoricalManuscriptView.js.map